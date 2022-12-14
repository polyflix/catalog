import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException
} from "@nestjs/common";

import {
  CreateCourseDto,
  UpdateCourseDto
} from "../../application/dto/course.dto";
import { Result } from "@swan-io/boxed";

import { Course } from "../../domain/models/course.model";
import { CourseApiMapper } from "../adapters/mappers/course.api.mapper";
import { PsqlCourseRepository } from "../adapters/repositories/psql-course.repository";
import {
  CourseParams,
  DefaultCourseParams
} from "../filters/params/course.param";
import { PsqlModuleRepository } from "../adapters/repositories/psql-module.repository";
import {
  InjectKafkaClient,
  PolyflixKafkaMessage,
  TriggerType
} from "@polyflix/x-utils";
import { ClientKafka } from "@nestjs/microservices";
import { KAFKA_COURSE_TOPIC } from "../../../constants/kafka.topics";
import { Visibility } from "src/main/constants/content.enum";
@Injectable()
export class CourseService {
  protected readonly logger = new Logger(CourseService.name);

  constructor(
    private readonly courseApiMapper: CourseApiMapper,
    private readonly psqlCourseRepository: PsqlCourseRepository,
    private readonly psqlModuleRepository: PsqlModuleRepository,
    @InjectKafkaClient() private readonly kafkaClient: ClientKafka
  ) {}

  async create(userId: string, dto: CreateCourseDto): Promise<Course> {
    const course: Course = this.courseApiMapper.apiToEntity({
      ...dto,
      ...{ user: { id: userId } }
    });
    if (dto.modules && dto.modules.length) {
      const mods = await this.psqlModuleRepository.findByIds(dto.modules);
      mods.match({
        Some: (value) => {
          course.modules = value;
        },
        None: () => {
          throw new BadRequestException("Modules not found");
        }
      });
    }
    const model: Result<Course, Error> = await this.psqlCourseRepository.create(
      course
    );

    return model.match({
      Ok: (value) => {
        this.kafkaClient.emit<string, PolyflixKafkaMessage>(
          KAFKA_COURSE_TOPIC,
          {
            key: value.slug,
            value: {
              trigger: TriggerType.CREATE,
              payload: value
            }
          }
        );
        return value;
      },
      Error: (e) => {
        this.logger.error(e);
        throw new BadRequestException(e.toString());
      }
    });
  }

  async findAll(
    params: CourseParams = DefaultCourseParams,
    userId: string,
    isAdmin: boolean
  ): Promise<Course[]> {
    const courses = await this.psqlCourseRepository.findAll(
      params,
      userId,
      isAdmin
    );
    return courses.match({
      Some: (value: Course[]) => value,
      None: () => []
    });
  }

  async findOne(
    slug: string,
    userId: string,
    isAdmin: boolean
  ): Promise<Course> {
    const model = await this.psqlCourseRepository.findOne(slug);

    return model.match({
      Some: (value: Course) => {
        const isCreator = value.user.id === userId;

        if (value.visibility === Visibility.PRIVATE && !isCreator && !isAdmin) {
          throw new ForbiddenException(
            "The course is private, you can't access it"
          );
        }

        return value;
      },
      None: () => {
        null;
        const error = "Course not found";
        this.logger.error(error);
        throw new NotFoundException(error);
      }
    });
  }

  async update(slug: string, dto: UpdateCourseDto): Promise<Course> {
    const course: Course = this.courseApiMapper.apiToEntity(dto);

    if (dto.modules && dto.modules.length) {
      const mods = await this.psqlModuleRepository.findByIds(dto.modules);
      mods.match({
        Some: (value) => {
          course.modules = value;
        },
        None: () => {
          throw new BadRequestException("Modules not found");
        }
      });
    }

    const model = await this.psqlCourseRepository.update(slug, course);
    return model.match({
      Some: (value) => {
        this.kafkaClient.emit<string, PolyflixKafkaMessage>(
          KAFKA_COURSE_TOPIC,
          {
            key: value.slug,
            value: {
              trigger: TriggerType.UPDATE,
              payload: value
            }
          }
        );
        return value;
      },
      None: () => {
        throw new UnprocessableEntityException(
          "This course cannot be updated right now, please try later"
        );
      }
    });
  }

  async delete(slug: string, userId: string, isAdmin: boolean) {
    const model = await this.psqlCourseRepository.delete(
      await this.findOne(slug, userId, isAdmin)
    );

    return model.match({
      Ok: (value) => {
        this.kafkaClient.emit<string, PolyflixKafkaMessage>(
          KAFKA_COURSE_TOPIC,
          {
            key: value.slug,
            value: {
              trigger: TriggerType.DELETE,
              payload: value
            }
          }
        );
        return value;
      },
      Error: (e) => {
        this.logger.error(e);
        throw new BadRequestException(e.toString());
      }
    });
  }

  async count(params: CourseParams): Promise<number> {
    return this.psqlCourseRepository.count(params);
  }
}

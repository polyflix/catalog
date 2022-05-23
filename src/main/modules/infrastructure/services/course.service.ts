import {
  BadRequestException,
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

@Injectable()
export class CourseService {
  protected readonly logger = new Logger(CourseService.name);

  constructor(
    private readonly courseApiMapper: CourseApiMapper,
    private readonly psqlCourseRepository: PsqlCourseRepository,
    private readonly psqlModuleRepository: PsqlModuleRepository
  ) {}

  async create(
    userId: string,
    courseCreateDto: CreateCourseDto
  ): Promise<Course> {
    const course: Course = this.courseApiMapper.apiToEntity(courseCreateDto);
    course.userId = userId;
    if (courseCreateDto.modules) {
      const mods = await this.psqlModuleRepository.findByIds(
        courseCreateDto.modules
      );
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
      Ok: (value) => value,
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

  async findOne(slug: string): Promise<Course> {
    const model = await this.psqlCourseRepository.findOne(slug);

    return model.match({
      Some: (value: Course) => value,
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

    if (dto.modules) {
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

    const model = await this.psqlCourseRepository.update(
      slug,
      this.courseApiMapper.apiToEntity(dto)
    );
    return model.match({
      Some: (value) => value,
      None: () => {
        throw new UnprocessableEntityException(
          "This course cannot be updated right now, please try later"
        );
      }
    });
  }

  async delete(slug: string) {
    const model = await this.psqlCourseRepository.delete(
      await this.findOne(slug)
    );

    return model.match({
      Ok: (value) => value,
      Error: (e) => {
        this.logger.error(e);
        throw new BadRequestException(e.toString());
      }
    });
  }
}

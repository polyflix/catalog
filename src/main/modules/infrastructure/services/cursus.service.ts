import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException
} from "@nestjs/common";

import {
  CreateCursusDto,
  UpdateCursusDto
} from "../../application/dto/cursus.dto";
import { Result } from "@swan-io/boxed";

import { Cursus } from "../../domain/models/cursus.model";
import { CursusApiMapper } from "../adapters/mappers/cursus.api.mapper";
import { PsqlCursusRepository } from "../adapters/repositories/psql-cursus.repository";
import {
  CursusParams,
  DefaultCursusParams
} from "../filters/params/cursus.param";
import { PsqlCourseRepository } from "../adapters/repositories/psql-course.repository";
import {
  InjectKafkaClient,
  PolyflixKafkaMessage,
  TriggerType
} from "@polyflix/x-utils";
import { ClientKafka } from "@nestjs/microservices";
import { KAFKA_CURSUS_TOPIC } from "../../../constants/kafka.topics";

@Injectable()
export class CursusService {
  protected readonly logger = new Logger(CursusService.name);

  constructor(
    private readonly cursusApiMapper: CursusApiMapper,
    private readonly psqlCursusRepository: PsqlCursusRepository,
    private readonly psqlCourseRepository: PsqlCourseRepository,
    @InjectKafkaClient() private readonly kafkaClient: ClientKafka
  ) {}

  async create(userId: string, dto: CreateCursusDto): Promise<Cursus> {
    const cursus: Cursus = this.cursusApiMapper.apiToEntity(dto);
    cursus.userId = userId;
    if (dto.courses && dto.courses.length) {
      const mods = await this.psqlCourseRepository.findByIds(dto.courses);
      mods.match({
        Some: (value) => {
          cursus.courses = value;
        },
        None: () => {
          throw new BadRequestException("Courses not found");
        }
      });
    }
    const model: Result<Cursus, Error> = await this.psqlCursusRepository.create(
      cursus
    );

    return model.match({
      Ok: (value) => {
        this.kafkaClient.emit<string, PolyflixKafkaMessage>(
          KAFKA_CURSUS_TOPIC,
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
    params: CursusParams = DefaultCursusParams,
    userId: string,
    isAdmin: boolean
  ): Promise<Cursus[]> {
    const cursuss = await this.psqlCursusRepository.findAll(
      params,
      userId,
      isAdmin
    );
    return cursuss.match({
      Some: (value: Cursus[]) => value,
      None: () => []
    });
  }

  async findOne(slug: string): Promise<Cursus> {
    const model = await this.psqlCursusRepository.findOne(slug);

    return model.match({
      Some: (value: Cursus) => value,
      None: () => {
        null;
        const error = "Cursus not found";
        this.logger.error(error);
        throw new NotFoundException(error);
      }
    });
  }

  async update(slug: string, dto: UpdateCursusDto): Promise<Cursus> {
    const cursus: Cursus = this.cursusApiMapper.apiToEntity(dto);
    if (dto.courses && dto.courses.length) {
      const mods = await this.psqlCourseRepository.findByIds(dto.courses);
      mods.match({
        Some: (value) => {
          cursus.courses = value;
        },
        None: () => {
          throw new BadRequestException("Courses not found");
        }
      });
    }
    const model = await this.psqlCursusRepository.update(slug, cursus);
    return model.match({
      Some: (value) => {
        this.kafkaClient.emit<string, PolyflixKafkaMessage>(
          KAFKA_CURSUS_TOPIC,
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
          "This cursus cannot be updated right now, please try later"
        );
      }
    });
  }

  async delete(slug: string) {
    const model = await this.psqlCursusRepository.delete(
      await this.findOne(slug)
    );

    return model.match({
      Ok: (value) => {
        this.kafkaClient.emit<string, PolyflixKafkaMessage>(
          KAFKA_CURSUS_TOPIC,
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
}

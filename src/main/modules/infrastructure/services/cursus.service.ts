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

@Injectable()
export class CursusService {
  protected readonly logger = new Logger(CursusService.name);

  constructor(
    private readonly cursusApiMapper: CursusApiMapper,
    private readonly psqlCursusRepository: PsqlCursusRepository,
    private readonly psqlCourseRepository: PsqlCourseRepository
  ) {}

  async create(
    userId: string,
    cursusCreateDto: CreateCursusDto
  ): Promise<Cursus> {
    const cursus: Cursus = this.cursusApiMapper.apiToEntity(cursusCreateDto);
    cursus.userId = userId;
    if (cursusCreateDto.courses) {
      const mods = await this.psqlCourseRepository.findByIds(
        cursusCreateDto.courses
      );
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
      Ok: (value) => value,
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
    if (dto.courses) {
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
      Some: (value) => value,
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
      Ok: (value) => value,
      Error: (e) => {
        this.logger.error(e);
        throw new BadRequestException(e.toString());
      }
    });
  }
}

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Option, Result } from "@swan-io/boxed";
import { CursusEntity } from "./entities/cursus.entity";
import { CursusRepository } from "../../../domain/ports/repositories/cursus.repository";
import { CursusEntityMapper } from "../mappers/cursus.entity.mapper";
import { Cursus } from "../../../domain/models/cursus.model";
import {
  CursusParams,
  DefaultCursusParams
} from "../../filters/params/cursus.param";
import { CursusFilter } from "../../filters/filters/cursus.filter";
import { omitUndefined } from "../../../../core/helpers/undefined";

@Injectable()
export class PsqlCursusRepository extends CursusRepository {
  constructor(
    @InjectRepository(CursusEntity)
    private readonly cursusRepo: Repository<CursusEntity>,
    private readonly cursusEntityMapper: CursusEntityMapper,
    private readonly cursusFilter: CursusFilter
  ) {
    super();
  }

  /**
   * Create a new entity based on cursus domain entity
   * @param cursus
   */
  async create(cursus: Cursus): Promise<Result<Cursus, Error>> {
    try {
      const result = await this.cursusRepo.save(
        this.cursusEntityMapper.apiToEntity(cursus)
      );
      return Result.Ok(this.cursusEntityMapper.entityToApi(result));
    } catch (e) {
      this.logger.error(e);
      return Result.Error(e);
    }
  }

  async findAll(
    params: CursusParams = DefaultCursusParams,
    userId: string,
    isAdmin: boolean
  ): Promise<Option<Cursus[]>> {
    const queryBuilder = this.cursusRepo
      .createQueryBuilder("cursus")
      .leftJoinAndSelect("cursus.courses", "courses");
    this.cursusFilter.buildFilters(queryBuilder, params, userId, isAdmin);
    this.cursusFilter.buildPaginationAndSort(queryBuilder, params);

    const result = await queryBuilder.getMany();
    if (result.length === 0) {
      return Option.None();
    }
    return Option.Some(this.cursusEntityMapper.entitiesToApis(result));
  }

  async findOne(slug: string): Promise<Option<Cursus>> {
    try {
      const result = await this.cursusRepo.findOne({
        relations: ["courses"],
        where: { slug }
      });
      if (result) {
        return Option.Some(this.cursusEntityMapper.entityToApi(result));
      }
      return Option.None();
    } catch (e) {
      this.logger.error(e);
      return Option.None();
    }
  }

  async update(slug: string, updateData: Cursus): Promise<Option<Cursus>> {
    try {
      const result = await this.cursusRepo.findOne({
        where: { slug }
      });
      if (!result) {
        throw new NotFoundException("Cursus not found");
      }

      const cursus = Object.assign(result, omitUndefined(updateData));
      const updatedCursus = await this.cursusRepo.save(
        this.cursusEntityMapper.apiToEntity(cursus)
      );

      return Option.Some(this.cursusEntityMapper.entityToApi(updatedCursus));
    } catch (e) {
      this.logger.error(e);
      return Option.None();
    }
  }

  async delete(cursus: Cursus): Promise<Result<Cursus, Error>> {
    try {
      await this.cursusRepo.remove(this.cursusEntityMapper.apiToEntity(cursus));
      return Result.Ok(cursus);
    } catch (e) {
      this.logger.error(e);
      return Result.Error(e);
    }
  }

  async count(params: CursusParams): Promise<number> {
    const queryBuilder = this.cursusRepo.createQueryBuilder("cursus");
    this.cursusFilter.totalCount(queryBuilder, params);

    const count = await queryBuilder.getCount();

    return count || 0;
  }
}

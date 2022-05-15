import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Option, Result } from "@swan-io/boxed";
import { ModuleEntity } from "./entities/module.entity";
import { ModuleRepository } from "../../../domain/ports/repositories/module.repository";
import { ModuleEntityMapper } from "../mappers/module.entity.mapper";
import { ModuleFilter } from "../../filters/filters/module.filter";
import { Module } from "../../../domain/models/module.model";
import {
  DefaultModuleParams,
  ModuleParams
} from "../../filters/params/module.param";
import { UpdateModuleDto } from "src/main/modules/application/dto/module.dto";

@Injectable()
export class PsqlModuleRepository extends ModuleRepository {
  constructor(
    @InjectRepository(ModuleEntity)
    private readonly moduleRepo: Repository<ModuleEntity>,
    private readonly moduleEntityMapper: ModuleEntityMapper,
    private readonly moduleFilter: ModuleFilter
  ) {
    super();
  }

  /**
   * Create a new entity based on module domain entity
   * @param module
   */
  async create(module: Module): Promise<Result<Module, Error>> {
    try {
      const result = await this.moduleRepo.save(
        this.moduleEntityMapper.apiToEntity(module)
      );
      return Result.Ok(this.moduleEntityMapper.entityToApi(result));
    } catch (e) {
      return Result.Error(e);
    }
  }

  async findAll(
    params: ModuleParams = DefaultModuleParams,
    userId: string,
    isAdmin: boolean
  ): Promise<Option<Module[]>> {
    const queryBuilder = this.moduleRepo.createQueryBuilder("module");
    this.moduleFilter.buildFilters(queryBuilder, params, userId, isAdmin);
    this.moduleFilter.buildPaginationAndSort(queryBuilder, params);

    const result = await queryBuilder.getMany();
    if (result.length === 0) {
      return Option.None();
    }
    return Option.Some(this.moduleEntityMapper.entitiesToApis(result));
  }

  async findOne(slug: string): Promise<Option<Module>> {
    try {
      const result = await this.moduleRepo.findOne({
        where: { slug }
      });
      if (result) {
        return Option.Some(this.moduleEntityMapper.entityToApi(result));
      }
      return Option.None();
    } catch (e) {
      return Option.None();
    }
  }

  async update(
    slug: string,
    updateData: UpdateModuleDto
  ): Promise<Option<Module>> {
    try {
      const result = await this.moduleRepo.findOne({
        where: { slug }
      });

      const updatedModule = await this.moduleRepo.save(
        Object.assign(result, updateData)
      );

      return Option.Some(this.moduleEntityMapper.entityToApi(updatedModule));
    } catch (e) {
      return Option.None();
    }
  }

  async delete(module: Module): Promise<Result<Module, Error>> {
    try {
      await this.moduleRepo.remove(this.moduleEntityMapper.apiToEntity(module));
      return Result.Ok(module);
    } catch (e) {
      return Result.Error(e);
    }
  }
}

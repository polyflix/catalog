import { Logger } from "@nestjs/common";
import { Option, Result } from "@swan-io/boxed";
import { UpdateModuleDto } from "src/main/modules/application/dto/module.dto";
import { ModuleParams } from "src/main/modules/infrastructure/filters/params/module.param";
import { Module } from "../../models/module.model";

export abstract class ModuleRepository {
  protected readonly logger = new Logger(this.constructor.name);

  abstract findAll(
    params: ModuleParams,
    userId: string,
    isAdmin: boolean
  ): Promise<Option<Module[]>>;

  abstract findOne(slug: string): Promise<Option<Module>>;

  abstract create(video: Module): Promise<Result<Module, Error>>;

  abstract update(
    slug: string,
    video: UpdateModuleDto
  ): Promise<Option<Partial<Module>>>;
}

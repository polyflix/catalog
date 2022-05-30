import { Logger } from "@nestjs/common";
import { Option, Result } from "@swan-io/boxed";
import { ModuleParams } from "../../../../modules/infrastructure/filters/params/module.param";
import { Module } from "../../models/module.model";

export abstract class ModuleRepository {
  protected readonly logger = new Logger(this.constructor.name);

  abstract findAll(
    params: ModuleParams,
    userId: string,
    isAdmin: boolean
  ): Promise<Option<Module[]>>;

  abstract findOne(slug: string): Promise<Option<Module>>;

  abstract create(module: Module): Promise<Result<Module, Error>>;

  abstract update(
    slug: string,
    module: Module
  ): Promise<Option<Partial<Module>>>;
}

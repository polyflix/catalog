import { Injectable } from "@nestjs/common";
import { AbstractMapper } from "../../../../core/helpers/abstract.mapper";
import { Module, ModuleProps } from "../../../domain/models/module.model";
import { ModuleEntity } from "../repositories/entities/module.entity";
import { PasswordEntityMapper } from "./password.entity.mapper";

@Injectable()
export class ModuleEntityMapper extends AbstractMapper<ModuleEntity, Module> {
  constructor(private readonly passwordEntityMapper: PasswordEntityMapper) {
    super();
  }
  apiToEntity(apiModel: Module): ModuleEntity {
    const entity = new ModuleEntity();
    Object.assign(entity, apiModel);
    return entity;
  }

  entityToApi(entity: ModuleEntity): Module {
    const moduleProps: ModuleProps = {
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      elements: [], // this.elementEntityMapper.entitiesToApis(entity.elements), //TODO: map element entity to Entity
      userId: entity.userId,
      visibility: entity.visibility,
      passwords: this.passwordEntityMapper.entitiesToApis(
        entity.passwords || []
      )
    };
    const module = Module.create(moduleProps);

    Object.assign(module, entity);
    return module;
  }
}

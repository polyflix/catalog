import { Injectable } from "@nestjs/common";
import { AbstractMapper } from "../../../../core/helpers/abstract.mapper";
import {
  CreateModuleDto,
  ModuleResponse
} from "../../../application/dto/module.dto";
import { Module, ModuleProps } from "../../../domain/models/module.model";

@Injectable()
export class ModuleApiMapper extends AbstractMapper<Module, ModuleResponse> {
  apiToEntity(apiModel: CreateModuleDto): Module {
    // TODO WARN
    const entity = Module.create(Object.assign(new ModuleProps(), apiModel));
    Object.assign(entity, apiModel);
    return entity;
  }

  entityToApi(entity: Module): ModuleResponse {
    const module = new ModuleResponse();
    Object.assign(module, entity);
    return module;
  }
}

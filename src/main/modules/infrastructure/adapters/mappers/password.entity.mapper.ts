import { Injectable } from "@nestjs/common";
import {
  Password,
  PasswordProps
} from "src/main/modules/domain/models/password.model";
import { AbstractMapper } from "../../../../core/helpers/abstract.mapper";
import { PasswordEntity } from "../repositories/entities/password.entity";

@Injectable()
export class PasswordEntityMapper extends AbstractMapper<
  PasswordEntity,
  Password
> {
  constructor() {
    super();
  }

  apiToEntity(apiModel: Password): PasswordEntity {
    const entity = new PasswordEntity();
    Object.assign(entity, apiModel);
    return entity;
  }

  entityToApi(entity: PasswordEntity): Password {
    const passwordProps: PasswordProps = {
      id: entity.id,
      name: entity.name,
      password: entity.password,
      isRevoked: entity.isRevoked,
      expiresAt: entity.expiresAt,
      moduleId: entity.moduleId
    };
    const course = Password.create(passwordProps);

    Object.assign(course, entity);
    return course;
  }
}

import { Injectable } from "@nestjs/common";
import { User } from "../../../../modules/domain/models/user.model";
import { AbstractMapper } from "../../../../core/helpers/abstract.mapper";
import { UserEntity } from "../repositories/entities/user.entity";

@Injectable()
export class UserEntityMapper extends AbstractMapper<UserEntity, User> {
  apiToEntity(apiModel: User): UserEntity {
    const user = new UserEntity();
    Object.assign(user, {
      userId: apiModel.id,
      avatar: apiModel.avatar,
      firstName: apiModel.firstName,
      lastName: apiModel.lastName
    });
    return user;
  }

  entityToApi(entity: UserEntity): User {
    const props: User = {
      id: entity.id,
      avatar: entity.avatar,
      firstName: entity.firstName,
      lastName: entity.lastName
    };
    return Object.assign(
      new User(entity.id, entity.avatar, entity.firstName, entity.lastName),
      props
    );
  }
}

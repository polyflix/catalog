import { Injectable } from "@nestjs/common";
import { AbstractMapper } from "../../../../core/helpers/abstract.mapper";
import { UserDto } from "../../../application/dto/user.dto";
import { User } from "../../../domain/models/user.model";

@Injectable()
export class UserApiMapper extends AbstractMapper<User, UserDto> {
  apiToEntity(apiModel: UserDto): User {
    const entity = new User(
      apiModel.id,
      apiModel.avatar,
      apiModel.firstName,
      apiModel.lastName
    );
    Object.assign(entity, apiModel);
    return entity;
  }

  entityToApi(entity: User): UserDto {
    const user = new UserDto();
    Object.assign(user, entity);
    return user;
  }
}

import { Option, Result } from "@swan-io/boxed";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";
import { UserRepository } from "../../../domain/ports/repositories/user.repository";
import { User } from "../../../domain/models/user.model";
import { UserEntityMapper } from "../mappers/user.entity.mapper";

export class PsqlUserRepository extends UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly userEntityMapper: UserEntityMapper
  ) {
    super();
  }

  async create(user: User): Promise<Result<User, Error>> {
    this.logger.log(`Create a user with id ${user.id}`);

    try {
      const result = await this.userRepo.save(
        this.userEntityMapper.apiToEntity(user)
      );
      return Result.Ok(this.userEntityMapper.entityToApi(result));
    } catch (e) {
      this.logger.warn(`Cannot create user with id ${user.id}. Error: ${e}`);
      return Result.Error(e);
    }
  }

  async update(userId: string, user: User): Promise<Option<Partial<User>>> {
    this.logger.log(`Update a user with id ${user.id}`);

    try {
      await this.userRepo.update(
        userId,
        this.userEntityMapper.apiToEntity(user)
      );
      return Option.Some(user);
    } catch (e) {
      this.logger.warn(`Cannot update user with id ${user.id}. Error: ${e}`);
      return Option.None();
    }
  }

  async delete(user: User): Promise<Result<void, Error>> {
    this.logger.log(`Delete user with id ${user.id}`);

    try {
      await this.userRepo.remove(this.userEntityMapper.apiToEntity(user));
      return Result.Ok(null);
    } catch (e) {
      this.logger.warn(`Cannot delete user with id ${user.id}. Error: ${e}`);
      return Result.Error(e);
    }
  }
}

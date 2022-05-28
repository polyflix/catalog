import { Option, Result } from "@swan-io/boxed";
import { Logger } from "@nestjs/common";
import { User } from "../../models/user.model";

export abstract class UserRepository {
  protected readonly logger = new Logger(this.constructor.name);

  abstract create(user: User): Promise<Result<User, Error>>;

  abstract update(userId: string, user: User): Promise<Option<Partial<User>>>;

  abstract delete(user: User): Promise<Result<void, Error>>;
}

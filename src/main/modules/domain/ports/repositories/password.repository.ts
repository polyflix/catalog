import { Logger } from "@nestjs/common";
import { Password } from "../../models/password.model";
import { Option } from "@swan-io/boxed";

export abstract class PasswordRepository {
  protected readonly logger = new Logger(this.constructor.name);

  abstract findOne(
    moduleEntityId: string,
    accessKey: string
  ): Promise<Option<Password>>;

  abstract revoke(password: Password): Promise<void>;

  abstract create(password: Password): Promise<Password>;
}

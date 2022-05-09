import { Result } from "@swan-io/boxed";
import { PasswordInvalidError } from "../errors/password-invalid.error";

export class PasswordProps {
  id: string;
  name: string;
  password: string;
  isRevoked: boolean;
  expiresAt?: Date;
  moduleId: string;
}

export class Password {
  private constructor(
    public id: string,
    public name: string,
    public password: string,
    public isRevoked: boolean,
    public moduleId: string,
    public expiresAt?: Date
  ) {}

  static create(props: PasswordProps): Password {
    const element = new Password(
      props.id,
      props.name,
      props.password,
      props.isRevoked,
      props.moduleId,
      props.expiresAt
    );

    return element.validate().match({
      Ok: () => element,
      Error: (e) => {
        throw new PasswordInvalidError(e);
      }
    });
  }

  private validate(): Result<string, string> {
    return Result.Ok("Password valid");
  }
}

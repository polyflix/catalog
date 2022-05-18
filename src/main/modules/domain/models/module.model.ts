import { Result } from "@swan-io/boxed";
import { ModuleInvalidError } from "../errors/module-invalid.error";

export class ModuleProps {
  name: string;
  slug: string;
  description: string;
  elements: Element[];
  userId: string;
}

export class Module {
  private constructor(
    public name: string,
    public slug: string,
    public description: string,
    public elements: Element[],
    public userId: string,
    public id?: string
  ) {}

  static create(props: ModuleProps): Module {
    const module = new Module(
      props.name,
      props.slug,
      props.description,
      props.elements,
      props.userId
    );

    return module.validate().match({
      Ok: () => module,
      Error: (e) => {
        throw new ModuleInvalidError(e);
      }
    });
  }

  private validate(): Result<string, string> {
    return Result.Ok("Module valid");
  }
}

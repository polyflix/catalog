import { Result } from "@swan-io/boxed";
import { ModuleInvalidError } from "../errors/module-invalid.error";
import { Password } from "./password.model";
import { Element } from "./element.model";
import { Visibility } from "src/main/constants/content.enum";

export class ModuleProps {
  name: string;
  slug: string;
  description: string;
  elements: Element[];
  visibility: Visibility;
  userId: string;
  passwords?: Password[];
}

export class ModuleToElement {
  public moduleId: string;
  public elementId: string;
  public order: number;
}
export class Module {
  private constructor(
    public name: string,
    public slug: string,
    public description: string,
    public elements: Element[] | ModuleToElement[],
    public userId: string,
    public visibility: Visibility,
    public passwords?: Password[],
    public id?: string
  ) {}

  static create(props: ModuleProps): Module {
    const module = new Module(
      props.name,
      props.slug,
      props.description,
      props.elements,
      props.userId,
      props.visibility,
      props.passwords
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

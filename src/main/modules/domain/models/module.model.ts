import { Result } from "@swan-io/boxed";
import { ModuleInvalidError } from "../errors/module-invalid.error";
import { Password } from "./password.model";
import { Element } from "./element.model";
import { Visibility } from "src/main/constants/content.enum";
import { User } from "./user.model";

export class ModuleProps {
  name: string;
  slug: string;
  description: string;
  elements: Element[];
  visibility: Visibility;
  user: User;
  passwords?: Password[];
  draft: boolean;
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
    public user: User,
    public visibility: Visibility,
    public passwords?: Password[],
    public draft?: boolean,
    public id?: string
  ) {}

  static create(props: ModuleProps): Module {
    const module = new Module(
      props.name,
      props.slug,
      props.description,
      props.elements,
      props.user,
      props.visibility,
      props.passwords,
      props.draft
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

import { Option, Result } from "@swan-io/boxed";
import { Logger } from "@nestjs/common";
import { Element } from "../../models/element.model";

export abstract class ElementRepository {
  protected readonly logger = new Logger(this.constructor.name);

  abstract create(element: Element): Promise<Result<Element, Error>>;

  abstract update(
    elementId: string,
    element: Element
  ): Promise<Option<Partial<Element>>>;

  abstract delete(element: Element): Promise<Result<void, Error>>;
}

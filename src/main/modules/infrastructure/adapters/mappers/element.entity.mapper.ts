import { Injectable } from "@nestjs/common";
import { Element } from "../../../domain/models/element.model";
import { AbstractMapper } from "../../../../core/helpers/abstract.mapper";
import { ElementEntity } from "../repositories/entities/element.entity";

@Injectable()
export class ElementEntityMapper extends AbstractMapper<
  ElementEntity,
  Element
> {
  apiToEntity(apiModel: Element): ElementEntity {
    const element = new ElementEntity();
    Object.assign(element, {
      id: apiModel.id,
      name: apiModel.name,
      slug: apiModel.slug,
      type: apiModel.type,
      description: apiModel.description,
      thumbnail: apiModel.thumbnail,
      userId: apiModel.userId,
      visibility: apiModel.visibility,
      draft: apiModel.draft
    });
    return element;
  }

  entityToApi(entity: ElementEntity): Element {
    const element: Element = {
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      type: entity.type,
      description: entity.description,
      thumbnail: entity.thumbnail,
      userId: entity.userId,
      visibility: entity.visibility,
      draft: entity.draft,
      order: entity.order
    };
    return element;
  }
}

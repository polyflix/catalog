import { Injectable } from "@nestjs/common";
import { ElementDto } from "../../../../modules/application/dto/element.dto";
import { AbstractMapper } from "../../../../core/helpers/abstract.mapper";
import { Element } from "../../../domain/models/element.model";

@Injectable()
export class ElementApiMapper extends AbstractMapper<Element, ElementDto> {
  apiToEntity(apiModel: ElementDto): Element {
    const element: Element = {
      id: apiModel.id,
      name: apiModel.name || apiModel.title,
      slug: apiModel.slug,
      type: apiModel.type,
      description: apiModel.description,
      thumbnail: apiModel.thumbnail,
      userId: apiModel.userId || apiModel.publisherId,
      visibility: apiModel.visibility,
      draft: apiModel.draft,
      order: apiModel.order
    };
    return element;
  }

  entityToApi(entity: Element): ElementDto {
    const element = new ElementDto();
    Object.assign(element, entity);
    return element;
  }
}

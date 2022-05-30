import { Injectable } from "@nestjs/common";
import { ElementRepository } from "../../domain/ports/repositories/element.repository";
import { ElementApiMapper } from "../adapters/mappers/element.api.mapper";
import { Element } from "../../domain/models/element.model";

@Injectable()
export class ElementService {
  constructor(
    private readonly elementApiMapper: ElementApiMapper,
    private readonly elementRepository: ElementRepository
  ) {}

  async update(element: Element): Promise<void> {
    await this.elementRepository.update(element.id, element);
  }

  async create(element: Element): Promise<void> {
    await this.elementRepository.create(element);
  }

  async delete(element: Element): Promise<void> {
    await this.elementRepository.delete(element);
  }
}

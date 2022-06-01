import { Option, Result } from "@swan-io/boxed";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ElementEntity } from "./entities/element.entity";
import { ElementRepository } from "../../../domain/ports/repositories/element.repository";
import { Element } from "../../../domain/models/element.model";
import { ElementEntityMapper } from "../mappers/element.entity.mapper";

export class PsqlElementRepository extends ElementRepository {
  constructor(
    @InjectRepository(ElementEntity)
    private readonly elementRepo: Repository<ElementEntity>,
    private readonly elementEntityMapper: ElementEntityMapper
  ) {
    super();
  }

  async create(element: Element): Promise<Result<Element, Error>> {
    this.logger.log(`Create a element with id ${element.id}`);

    try {
      const result = await this.elementRepo.save(
        this.elementEntityMapper.apiToEntity(element)
      );
      return Result.Ok(this.elementEntityMapper.entityToApi(result));
    } catch (e) {
      this.logger.warn(
        `Cannot create element with id ${element.id}. Error: ${e}`
      );
      return Result.Error(e);
    }
  }

  async update(
    elementId: string,
    element: Element
  ): Promise<Option<Partial<Element>>> {
    this.logger.log(`Update a element with id ${element.id}`);

    try {
      await this.elementRepo.update(
        elementId,
        this.elementEntityMapper.apiToEntity(element)
      );
      return Option.Some(element);
    } catch (e) {
      this.logger.warn(
        `Cannot update element with id ${element.id}. Error: ${e}`
      );
      return Option.None();
    }
  }

  async delete(element: Element): Promise<Result<void, Error>> {
    this.logger.log(`Delete element with id ${element.id}`);

    try {
      await this.elementRepo.remove(
        this.elementEntityMapper.apiToEntity(element)
      );
      return Result.Ok(null);
    } catch (e) {
      this.logger.warn(
        `Cannot delete element with id ${element.id}. Error: ${e}`
      );
      return Result.Error(e);
    }
  }

  async findByIds(ids: string[]): Promise<Option<Element[]>> {
    const result = await this.elementRepo.findByIds(ids);
    if (result.length === 0) {
      return Option.None();
    }
    return Option.Some(this.elementEntityMapper.entitiesToApis(result));
  }
}

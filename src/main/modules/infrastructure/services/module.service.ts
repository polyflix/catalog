import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException
} from "@nestjs/common";

import {
  CreateModuleDto,
  UpdateModuleDto
} from "../../application/dto/module.dto";
import { Result } from "@swan-io/boxed";
import {
  DefaultModuleParams,
  ModuleParams
} from "../filters/params/module.param";
import { Module, ModuleToElement } from "../../domain/models/module.model";
import { ModuleApiMapper } from "../adapters/mappers/module.api.mapper";
import { PsqlModuleRepository } from "../adapters/repositories/psql-module.repository";
import { ClientKafka } from "@nestjs/microservices";
import {
  InjectKafkaClient,
  PolyflixKafkaMessage,
  TriggerType
} from "@polyflix/x-utils";
import { KAFKA_MODULE_TOPIC } from "src/main/constants/kafka.topics";
import { PsqlElementRepository } from "../adapters/repositories/psql-element.repository";
import { ElementService } from "./element.service";
import { Element } from "../../domain/models/element.model";

@Injectable()
export class ModuleService {
  protected readonly logger = new Logger(ModuleService.name);

  constructor(
    private readonly moduleApiMapper: ModuleApiMapper,
    private readonly elementService: ElementService,
    private readonly psqlModuleRepository: PsqlModuleRepository,
    private readonly psqlElementRepository: PsqlElementRepository,
    @InjectKafkaClient() private readonly kafkaClient: ClientKafka
  ) {}

  async create(userId: string, dto: CreateModuleDto): Promise<Module> {
    const module: Module = this.moduleApiMapper.apiToEntity(dto);
    module.userId = userId;
    // We can't allow orders duplicate, even if it is blocked in the database
    // we prevent it here so we have a gentle error
    if (dto.elements && dto.elements.length) {
      const elementOrders = dto.elements.map((i) => i.order);
      if (
        elementOrders.filter((i, index) => elementOrders.indexOf(i) != index)
          .length > 0
      )
        throw new BadRequestException("Two elements have the same order");
    }
    if (dto.elements) {
      const mods = await this.psqlElementRepository.findByIds(
        dto.elements.map((i) => i.elementId)
      );
      mods.match({
        Some: () => {
          //
        },
        None: () => {
          throw new BadRequestException("Element not found");
        }
      });
    }
    const model: Result<Module, Error> = await this.psqlModuleRepository.create(
      module
    );

    return model.match({
      Ok: (value) => {
        this.kafkaClient.emit<string, PolyflixKafkaMessage>(
          KAFKA_MODULE_TOPIC,
          {
            key: value.slug,
            value: {
              trigger: TriggerType.CREATE,
              payload: value
            }
          }
        );
        return value;
      },
      Error: (e) => {
        this.logger.error(e);
        throw new BadRequestException(e.toString());
      }
    });
  }

  async findAll(
    params: ModuleParams = DefaultModuleParams,
    userId: string,
    isAdmin: boolean
  ): Promise<Module[]> {
    const modules = await this.psqlModuleRepository.findAll(
      params,
      userId,
      isAdmin
    );
    return modules.match({
      Some: async (values: Module[]) => {
        for (const i of values) {
          await this.fetchWithElements(i);
        }
        return values;
      },
      None: () => Promise.all([])
    });
  }

  async findOne(slug: string): Promise<Module> {
    const model = await this.psqlModuleRepository.findOne(slug);

    return model.match({
      Some: async (value: Module) => {
        await this.fetchWithElements(value);
        return value;
      },
      None: () => {
        const error = "Module not found";
        this.logger.error(error);
        throw new NotFoundException(error);
      }
    });
  }

  async update(slug: string, dto: UpdateModuleDto): Promise<Module> {
    if (dto.elements && dto.elements.length) {
      const elementOrders = dto.elements.map((i) => i.order);
      if (
        elementOrders.filter((i, index) => elementOrders.indexOf(i) != index)
          .length > 0
      )
        throw new BadRequestException("Two elements have the same order");
    }
    const model = await this.psqlModuleRepository.update(
      slug,
      this.moduleApiMapper.apiToEntity(dto)
    );
    return model.match({
      Some: (value) => {
        this.kafkaClient.emit<string, PolyflixKafkaMessage>(
          KAFKA_MODULE_TOPIC,
          {
            key: value.slug,
            value: {
              trigger: TriggerType.UPDATE,
              payload: value
            }
          }
        );
        return value;
      },
      None: () => {
        throw new UnprocessableEntityException(
          "This module cannot be updated right now, please try later"
        );
      }
    });
  }

  async delete(slug: string) {
    const model = await this.psqlModuleRepository.delete(
      await this.findOne(slug)
    );

    return model.match({
      Ok: (value) => {
        this.kafkaClient.emit<string, PolyflixKafkaMessage>(
          KAFKA_MODULE_TOPIC,
          {
            key: value.slug,
            value: {
              trigger: TriggerType.DELETE,
              payload: value
            }
          }
        );
        return value;
      },
      Error: (e) => {
        this.logger.error(e);
        throw new BadRequestException(e.toString());
      }
    });
  }

  async fetchWithElements(module: Module) {
    const elements = await this.psqlElementRepository.findByIds(
      module.elements.map((i) => i.elementId)
    );

    const modToElement = module.elements as ModuleToElement[];
    return elements.match({
      Some: (elements) => {
        module.elements = elements.map((item) => ({
          ...item,
          order: modToElement.find((i) => i.elementId === item.id)?.order
        }));

        module.elements = module.elements.sort((a, b) => a.order - b.order);
        return elements;
      },
      None: () => {
        //
      }
    });
  }
}

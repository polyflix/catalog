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
import { ConfigService } from "@nestjs/config";
import { Result } from "@swan-io/boxed";
import {
  DefaultModuleParams,
  ModuleParams
} from "../filters/params/module.param";
import { Module } from "../../domain/models/module.model";
import { ModuleApiMapper } from "../adapters/mappers/module.api.mapper";
import { PsqlModuleRepository } from "../adapters/repositories/psql-module.repository";

@Injectable()
export class ModuleService {
  protected readonly logger = new Logger(ModuleService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly moduleApiMapper: ModuleApiMapper,
    private readonly psqlModuleRepository: PsqlModuleRepository
  ) {}

  async create(
    userId: string,
    moduleCreateDto: CreateModuleDto
  ): Promise<Module> {
    const module: Module = this.moduleApiMapper.apiToEntity(moduleCreateDto);
    module.userId = userId;
    // We can't allow orders duplicate, even if it is blocked in the database
    // we prevent it here so we have a gentle error
    if (moduleCreateDto.elements) {
      const elementOrders = moduleCreateDto.elements.map((i) => i.order);
      if (
        elementOrders.filter((i, index) => elementOrders.indexOf(i) != index)
          .length > 0
      )
        throw new BadRequestException("Two elements have the same order");
    }
    //TODO
    // if (moduleCreateDto.elements) {
    //   const mods = await this.psqlElementRepository.findByIds(
    //     moduleCreateDto.elements
    //   );
    //   mods.match({
    //     Some: (value) => {
    //       module.elements = value;
    //     },
    //     None: () => {
    //       throw new BadRequestException("Element not found");
    //     }
    //   });
    // }
    const model: Result<Module, Error> = await this.psqlModuleRepository.create(
      module
    );

    return model.match({
      Ok: (value) => value,
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
      Some: (value: Module[]) => value,
      None: () => []
    });
  }

  async findOne(slug: string): Promise<Module> {
    const model = await this.psqlModuleRepository.findOne(slug);

    return model.match({
      Some: (value: Module) => value,
      None: () => {
        null;
        const error = "Module not found";
        this.logger.error(error);
        throw new NotFoundException(error);
      }
    });
  }

  async update(slug: string, dto: UpdateModuleDto): Promise<Module> {
    const model = await this.psqlModuleRepository.update(
      slug,
      this.moduleApiMapper.apiToEntity(dto)
    );
    return model.match({
      Some: (value) => value,
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
      Ok: (value) => value,
      Error: (e) => {
        this.logger.error(e);
        throw new BadRequestException(e.toString());
      }
    });
  }
}

import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { ModuleParams } from "../filters/params/module.param";
import { ModuleService } from "../services/module.service";
import { Module } from "../../domain/models/module.model";
import {
  CreateModuleDto,
  ModuleResponse,
  UpdateModuleDto
} from "../../application/dto/module.dto";
import { ModuleApiMapper } from "../adapters/mappers/module.api.mapper";
import { MeId, IsAdmin } from "@polyflix/x-utils";
import { Paginate } from "src/main/core/types/pagination.type";

@ApiTags("Module")
@Controller("modules")
export class ModuleController {
  constructor(
    private readonly moduleService: ModuleService,
    private readonly moduleApiMapper: ModuleApiMapper
  ) {}

  private readonly logger = new Logger(ModuleController.name);

  @Get()
  @UsePipes(new ValidationPipe({ transform: true })) //to add default value pagination query
  async findAll(
    @MeId() userId: string,
    @IsAdmin() isAdmin: boolean,
    @Query() query: ModuleParams
  ): Promise<Paginate<ModuleResponse>> {
    const modules: Module[] = await this.moduleService.findAll(
      query,
      userId,
      isAdmin
    );
    return {
      data: modules.map(this.moduleApiMapper.entityToApi),
      total: modules.length,
      page: query.page,
      pageSize: query.pageSize
    };
  }

  @Get("/:slug")
  async findOne(@Param("slug") slug: string): Promise<ModuleResponse> {
    this.logger.log(`GET /modules/${slug} received`);
    const module: Module = await this.moduleService.findOne(slug);
    return this.moduleApiMapper.entityToApi(module);
  }

  @Put("/:slug")
  async update(
    @MeId() userId: string,
    @IsAdmin() isAdmin: boolean,
    @Param("slug") slug: string,
    @Body() body: UpdateModuleDto
  ): Promise<ModuleResponse> {
    //TODO later: check order
    this.logger.log(
      `PUT /modules/${slug} received body: ${JSON.stringify(body)}`
    );
    await this.canExecuteAction(slug, userId, isAdmin);
    const module: Module = await this.moduleService.update(slug, body);
    this.logger.log(`Successfully updated module ${module.slug}`);
    return this.moduleApiMapper.entityToApi(module);
  }

  @Post()
  @ApiResponse({
    description: "The record has been successfully created.",
    type: ModuleResponse
  })
  async create(
    @MeId() userId: string,
    @Body() body: CreateModuleDto
  ): Promise<ModuleResponse> {
    this.logger.log(`POST /modules received body: ${JSON.stringify(body)}`);
    //TODO later: check order
    // if (body.elementToCollection) {
    //   const elementOrders = body.elementToCollection.map((i) => i.order);
    //   if (
    //     elementOrders.filter((i, index) => elementOrders.indexOf(i) != index)
    //       .length > 0
    //   )
    //     throw new BadRequestException('Two elements have the same order');
    // }
    const module: Module = await this.moduleService.create(userId, body);
    this.logger.log(`Successfully created module ${module.slug}`);
    return this.moduleApiMapper.entityToApi(module);
  }

  @Delete("/:slug")
  @HttpCode(204)
  async delete(
    @MeId() userId: string,
    @IsAdmin() isAdmin: boolean,
    @Param("slug") slug: string
  ) {
    // throw new NotFoundException();
    this.logger.log(`DELETE /modules/${slug} received`);
    await this.canExecuteAction(slug, userId, isAdmin);
    await this.moduleService.delete(slug);
  }

  /**
   * A helper function to check if the user is able to execute an action on the entity.
   * @param slug the slug of the collection to check
   * @param user the user to check
   * @param isAdmin set this to true if the user is admin
   * @returns true if the user can execute an action
   */
  private async canExecuteAction(
    slug: string,
    userId: string,
    isAdmin: boolean
  ): Promise<boolean> {
    // If we are administrator, we can do anything
    if (isAdmin) return true;

    // Get the entity in order to check if the user can update it.
    const entity: Module = await this.moduleService.findOne(slug);

    // if the user is not the creator of the resource
    if (entity.userId !== userId) {
      throw new ForbiddenException(
        "You cannot execute this action on a resource that you didn't own."
      );
    }

    return true;
  }
}

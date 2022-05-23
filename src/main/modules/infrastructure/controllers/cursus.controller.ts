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
import { IsAdmin, MeId } from "@polyflix/x-utils";
import { Paginate } from "src/main/core/types/pagination.type";
import {
  CursusResponse,
  CreateCursusDto,
  UpdateCursusDto
} from "../../application/dto/cursus.dto";
import { Cursus } from "../../domain/models/cursus.model";
import { CursusApiMapper } from "../adapters/mappers/cursus.api.mapper";
import { CursusParams } from "../filters/params/cursus.param";
import { CursusService } from "../services/cursus.service";

@ApiTags("Cursus")
@Controller("cursus")
export class CursusController {
  constructor(
    private readonly cursusService: CursusService,
    private readonly cursusApiMapper: CursusApiMapper
  ) {}

  private readonly logger = new Logger(CursusController.name);

  @Get()
  @UsePipes(new ValidationPipe({ transform: true })) //to add default value pagination query
  async findAll(
    @MeId() userId: string,
    @IsAdmin() isAdmin: boolean,
    @Query() query: CursusParams
  ): Promise<Paginate<CursusResponse>> {
    const cursus: Cursus[] = await this.cursusService.findAll(
      query,
      userId,
      isAdmin
    );
    return {
      data: cursus.map(this.cursusApiMapper.entityToApi),
      total: cursus.length,
      page: query.page,
      pageSize: query.pageSize
    };
  }

  @Get("/:slug")
  async findOne(@Param("slug") slug: string): Promise<CursusResponse> {
    this.logger.log(`GET /cursus/${slug} received`);
    const cursus: Cursus = await this.cursusService.findOne(slug);
    return this.cursusApiMapper.entityToApi(cursus);
  }

  @Put("/:slug")
  async update(
    @MeId() userId: string,
    @IsAdmin() isAdmin: boolean,
    @Param("slug") slug: string,
    @Body() body: UpdateCursusDto
  ): Promise<CursusResponse> {
    this.logger.log(
      `PUT /cursus/${slug} received body: ${JSON.stringify(body)}`
    );
    await this.canExecuteAction(slug, userId, isAdmin);
    const cursus: Cursus = await this.cursusService.update(slug, body);
    this.logger.log(`Successfully updated cursus ${cursus.slug}`);
    return this.cursusApiMapper.entityToApi(cursus);
  }

  @Post()
  @ApiResponse({ type: CursusResponse })
  async create(
    @MeId() userId: string,
    @Body() body: CreateCursusDto
  ): Promise<CursusResponse> {
    this.logger.log(`POST /cursus received body: ${JSON.stringify(body)}`);
    const cursus: Cursus = await this.cursusService.create(userId, body);
    this.logger.log(`Successfully created cursus ${cursus.slug}`);
    return this.cursusApiMapper.entityToApi(cursus);
  }

  @Delete("/:slug")
  @HttpCode(204)
  async delete(
    @MeId() userId: string,
    @IsAdmin() isAdmin: boolean,
    @Param("slug") slug: string
  ) {
    // throw new NotFoundException();
    this.logger.log(`DELETE /cursus/${slug} received`);
    await this.canExecuteAction(slug, userId, isAdmin);
    await this.cursusService.delete(slug);
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
    const entity: Cursus = await this.cursusService.findOne(slug);

    // if the user is not the creator of the resource
    if (entity.userId !== userId) {
      throw new ForbiddenException(
        "You cannot execute this action on a resource that you didn't own."
      );
    }

    return true;
  }
}

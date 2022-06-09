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
  CourseResponse,
  CreateCourseDto,
  UpdateCourseDto
} from "../../application/dto/course.dto";
import { Course } from "../../domain/models/course.model";
import { CourseApiMapper } from "../adapters/mappers/course.api.mapper";
import { CourseParams } from "../filters/params/course.param";
import { CourseService } from "../services/course.service";

@ApiTags("Course")
@Controller("courses")
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly courseApiMapper: CourseApiMapper
  ) {}

  private readonly logger = new Logger(CourseController.name);

  @Get()
  @UsePipes(new ValidationPipe({ transform: true })) //to add default value pagination query
  async findAll(
    @MeId() userId: string,
    @IsAdmin() isAdmin: boolean,
    @Query() query: CourseParams
  ): Promise<Paginate<CourseResponse>> {
    const courses: Course[] = await this.courseService.findAll(
      query,
      userId,
      isAdmin
    );
    return {
      data: courses.map(this.courseApiMapper.entityToApi),
      total: await this.courseService.count(query),
      page: query.page,
      pageSize: query.pageSize
    };
  }

  @Get("/:slug")
  async findOne(@Param("slug") slug: string): Promise<CourseResponse> {
    this.logger.log(`GET /courses/${slug} received`);
    const course: Course = await this.courseService.findOne(slug);
    return this.courseApiMapper.entityToApi(course);
  }

  @Put("/:slug")
  async update(
    @MeId() userId: string,
    @IsAdmin() isAdmin: boolean,
    @Param("slug") slug: string,
    @Body() body: UpdateCourseDto
  ): Promise<CourseResponse> {
    this.logger.log(
      `PUT /courses/${slug} received body: ${JSON.stringify(body)}`
    );
    await this.canExecuteAction(slug, userId, isAdmin);
    const course: Course = await this.courseService.update(slug, body);
    this.logger.log(`Successfully updated course ${course.slug}`);
    return this.courseApiMapper.entityToApi(course);
  }

  @Post()
  @ApiResponse({ type: CourseResponse })
  async create(
    @MeId() userId: string,
    @Body() body: CreateCourseDto
  ): Promise<CourseResponse> {
    this.logger.log(`POST /courses received body: ${JSON.stringify(body)}`);
    const course: Course = await this.courseService.create(userId, body);
    this.logger.log(`Successfully created course ${course.slug}`);
    return this.courseApiMapper.entityToApi(course);
  }

  @Delete("/:slug")
  @HttpCode(204)
  async delete(
    @MeId() userId: string,
    @IsAdmin() isAdmin: boolean,
    @Param("slug") slug: string
  ) {
    // throw new NotFoundException();
    this.logger.log(`DELETE /courses/${slug} received`);
    await this.canExecuteAction(slug, userId, isAdmin);
    await this.courseService.delete(slug);
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
    const entity: Course = await this.courseService.findOne(slug);

    // if the user is not the creator of the resource
    if (entity.user.id !== userId) {
      throw new ForbiddenException(
        "You cannot execute this action on a resource that you didn't own."
      );
    }

    return true;
  }
}

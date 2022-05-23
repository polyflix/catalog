import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Option, Result } from "@swan-io/boxed";
import { CourseEntity } from "./entities/course.entity";
import { CourseRepository } from "../../../domain/ports/repositories/course.repository";
import { CourseEntityMapper } from "../mappers/course.entity.mapper";
import { Course } from "../../../domain/models/course.model";
import { UpdateCourseDto } from "src/main/modules/application/dto/course.dto";
import { CourseFilter } from "../../filters/filters/course.filter";
import {
  CourseParams,
  DefaultCourseParams
} from "../../filters/params/course.param";
import { omitUndefined } from "src/main/core/helpers/undefined";

@Injectable()
export class PsqlCourseRepository extends CourseRepository {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepo: Repository<CourseEntity>,
    private readonly courseEntityMapper: CourseEntityMapper,
    private readonly courseFilter: CourseFilter
  ) {
    super();
  }

  /**
   * Create a new entity based on course domain entity
   * @param course
   */
  async create(course: Course): Promise<Result<Course, Error>> {
    try {
      const result = await this.courseRepo.save(
        this.courseEntityMapper.apiToEntity(course)
      );
      return Result.Ok(this.courseEntityMapper.entityToApi(result));
    } catch (e) {
      return Result.Error(e);
    }
  }

  async findAll(
    params: CourseParams = DefaultCourseParams,
    userId: string,
    isAdmin: boolean
  ): Promise<Option<Course[]>> {
    const queryBuilder = this.courseRepo
      .createQueryBuilder("course")
      .leftJoinAndSelect("course.modules", "modules");
    this.courseFilter.buildFilters(queryBuilder, params, userId, isAdmin);
    this.courseFilter.buildPaginationAndSort(queryBuilder, params);

    const result = await queryBuilder.getMany();
    if (result.length === 0) {
      return Option.None();
    }
    return Option.Some(this.courseEntityMapper.entitiesToApis(result));
  }

  async findOne(slug: string): Promise<Option<Course>> {
    try {
      const result = await this.courseRepo.findOne({
        relations: ["modules"],
        where: { slug }
      });
      if (result) {
        return Option.Some(this.courseEntityMapper.entityToApi(result));
      }
      return Option.None();
    } catch (e) {
      return Option.None();
    }
  }

  async update(slug: string, updateData: Course): Promise<Option<Course>> {
    try {
      const result = await this.courseRepo.findOne({
        where: { slug }
      });

      if (!result) {
        throw new NotFoundException("Course not found");
      }
      const course = Object.assign(result, omitUndefined(updateData));
      const updatedCourse = await this.courseRepo.save(
        this.courseEntityMapper.apiToEntity(course)
      );

      return Option.Some(this.courseEntityMapper.entityToApi(updatedCourse));
    } catch (e) {
      return Option.None();
    }
  }

  async delete(course: Course): Promise<Result<Course, Error>> {
    try {
      await this.courseRepo.remove(this.courseEntityMapper.apiToEntity(course));
      return Result.Ok(course);
    } catch (e) {
      return Result.Error(e);
    }
  }

  async findByIds(ids: string[]): Promise<Option<Course[]>> {
    const result = await this.courseRepo.findByIds(ids);
    if (result.length === 0) {
      return Option.None();
    }
    return Option.Some(this.courseEntityMapper.entitiesToApis(result));
  }
}

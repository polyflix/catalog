import { Logger } from "@nestjs/common";
import { Option, Result } from "@swan-io/boxed";
import { CourseParams } from "src/main/modules/infrastructure/filters/params/course.param";
import { Course } from "../../models/course.model";

export abstract class CourseRepository {
  protected readonly logger = new Logger(this.constructor.name);

  abstract findAll(
    params: CourseParams,
    userId: string,
    isAdmin: boolean
  ): Promise<Option<Course[]>>;

  abstract findOne(slug: string): Promise<Option<Course>>;

  abstract create(course: Course): Promise<Result<Course, Error>>;

  abstract update(
    slug: string,
    course: Course
  ): Promise<Option<Partial<Course>>>;
}

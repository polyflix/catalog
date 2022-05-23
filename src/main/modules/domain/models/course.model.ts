import { Result } from "@swan-io/boxed";
import { CourseInvalidError } from "../errors/course-invalid.error";
import { Module } from "./module.model";

export class CourseProps {
  name: string;
  slug: string;
  description: string;
  content: string;
  modules: Module[];
  userId: string;
}

export class Course {
  private constructor(
    public name: string,
    public slug: string,
    public description: string,
    public content: string,
    public modules: Module[],
    public userId: string,
    public id?: string
  ) {}

  static create(props: CourseProps): Course {
    const course = new Course(
      props.name,
      props.slug,
      props.description,
      props.content,
      props.modules,
      props.userId
    );

    return course.validate().match({
      Ok: () => course,
      Error: (e) => {
        throw new CourseInvalidError(e);
      }
    });
  }

  private validate(): Result<string, string> {
    return Result.Ok("Course valid");
  }
}

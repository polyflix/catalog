import { Result } from "@swan-io/boxed";
import { CursusInvalidError } from "../errors/cursus-invalid.error";
import { Course } from "./course.model";

export class CursusProps {
  title: string;
  slug: string;
  description: string;
  courses: Course[];
  userId: string;
}

export class Cursus {
  private constructor(
    public title: string,
    public slug: string,
    public description: string,
    public courses: Course[],
    public userId: string,
    public id?: string
  ) {}

  static create(props: CursusProps): Cursus {
    const cursus = new Cursus(
      props.title,
      props.slug,
      props.description,
      props.courses,
      props.userId
    );

    return cursus.validate().match({
      Ok: () => cursus,
      Error: (e) => {
        throw new CursusInvalidError(e);
      }
    });
  }

  private validate(): Result<string, string> {
    return Result.Ok("Cursus valid");
  }
}

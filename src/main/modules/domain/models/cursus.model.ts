import { Result } from "@swan-io/boxed";
import { Visibility } from "src/main/constants/content.enum";
import { CursusInvalidError } from "../errors/cursus-invalid.error";
import { Course } from "./course.model";
import { User } from "./user.model";

export class CursusProps {
  title: string;
  slug: string;
  description: string;
  courses: Course[];
  user: User;
  visibility: Visibility;
  draft: boolean;
}

export class Cursus {
  private constructor(
    public title: string,
    public slug: string,
    public description: string,
    public courses: Course[],
    public user: User,
    public visibility: Visibility,
    public draft?: boolean,
    public id?: string
  ) {}

  static create(props: CursusProps): Cursus {
    const cursus = new Cursus(
      props.title,
      props.slug,
      props.description,
      props.courses,
      props.user,
      props.visibility,
      props.draft
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

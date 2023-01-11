import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IsArray, IsOptional } from "class-validator";
import { CourseEntity } from "../../infrastructure/adapters/repositories/entities/course.entity";
import { ModuleResponse } from "./module.dto";

export class CreateCourseDto extends OmitType(CourseEntity, [
  "id",
  "slug",
  "user",
  "createdAt",
  "updatedAt",
  "__v",
  "modules",
  "cursus",
  "generateSlug"
] as const) {
  @IsArray()
  @IsOptional({ always: true })
  modules?: string[]; // modules ids
}

export class UpdateCourseDto extends CreateCourseDto {}

export class CourseResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  visibility: string;

  @ApiProperty()
  title: string;

  // @ApiProperty()
  // slug: string;

  @ApiProperty()
  description: string;

  // @ApiProperty()
  // content: string;

  @ApiProperty()
  modules: ModuleResponse;
}

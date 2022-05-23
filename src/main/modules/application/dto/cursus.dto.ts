import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IsArray, IsOptional } from "class-validator";
import { CursusEntity } from "../../infrastructure/adapters/repositories/entities/cursus.entity";

export class CreateCursusDto extends OmitType(CursusEntity, [
  "id",
  "slug",
  "user",
  "createdAt",
  "updatedAt",
  "__v",
  "courses"
] as const) {
  @IsArray()
  @IsOptional({ always: true })
  courses?: string[]; // courses ids
}

export class UpdateCursusDto extends CreateCursusDto {}

export class CursusResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  visibility: string;

  @ApiProperty()
  draft: boolean;

  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description: string;
}

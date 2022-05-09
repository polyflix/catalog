import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IsArray, IsOptional } from "class-validator";
import { ModuleEntity } from "../../infrastructure/adapters/repositories/entities/module.entity";
import { PasswordEntity } from "../../infrastructure/adapters/repositories/entities/password.entity";
import { CreateModuleToElementDto } from "./moduleToElement.dto";

export class CreateModuleDto extends OmitType(ModuleEntity, [
  "id",
  "slug",
  "user",
  "createdAt",
  "updatedAt",
  "__v",
  "elements"
] as const) {
  @IsArray()
  @IsOptional({ always: true })
  elements?: CreateModuleToElementDto[]; // element ids and order
}

export class UpdateModuleDto extends CreateModuleDto {}

export class ModuleResponse {
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
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  passwords: PasswordEntity[];
}

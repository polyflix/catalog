import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IsArray, IsOptional } from "class-validator";
import { ModuleEntity } from "../../infrastructure/adapters/repositories/entities/module.entity";
import { CreateModuleToElementDto } from "./moduleToElement.dto";

export class CreateModuleDto extends OmitType(ModuleEntity, [
  "id",
  "slug",
  "user",
  "createdAt",
  "updatedAt",
  "__v",
  "elements",
  "elementToModule"
] as const) {
  @IsArray()
  @IsOptional({ always: true })
  elementToModule?: CreateModuleToElementDto[];
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
}

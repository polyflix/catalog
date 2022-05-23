import { OmitType } from "@nestjs/swagger";
import { ModuleToElementEntity } from "../../infrastructure/adapters/repositories/entities/moduleToElement.entity";

export class CreateModuleToElementDto extends OmitType(ModuleToElementEntity, [
  "module",
  "moduleId",
  "element"
] as const) {}

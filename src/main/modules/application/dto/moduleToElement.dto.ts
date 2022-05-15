import { OmitType } from "@nestjs/swagger";
import { ModuleToElementEntity } from "../../infrastructure/adapters/repositories/entities/moduleToElement.entity";

export class CreateModuleToElementDto extends OmitType(ModuleToElementEntity, [
  "moduleId",
  "module",
  "element"
] as const) {}

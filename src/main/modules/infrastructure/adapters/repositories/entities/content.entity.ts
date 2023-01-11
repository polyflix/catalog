import { Visibility } from "../../../../../constants/content.enum";
import { Column } from "typeorm";
import { BaseEntity } from "./base.entity";

export class ContentEntity extends BaseEntity {
  @Column({ enum: Visibility, type: "enum", default: Visibility.PUBLIC })
  visibility?: Visibility;
}

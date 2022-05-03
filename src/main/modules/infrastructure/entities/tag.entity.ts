import { BaseEntity } from "./base.entity";
import { Column, Entity, ManyToMany } from "typeorm";
import { ElementEntity } from "./element.entity";

@Entity("tag")
export class TagEntity extends BaseEntity {
  @Column("text", { unique: true })
  label: string;

  @Column({ length: 7, default: "#000000" })
  color: string;

  @Column({ default: false })
  isReviewed: boolean;

  @ManyToMany(() => ElementEntity, (element) => element.tags)
  elements?: ElementEntity[];
}

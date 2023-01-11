import {
  Column,
  Entity,
  PrimaryGeneratedColumn
  ManyToOne,
  OneToMany,
} from "typeorm";
import { ModuleToElementEntity } from "./moduleToElement.entity";

@Entity("element")
export class ElementEntity {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  type: string;

  @OneToMany(() => ModuleToElementEntity, (type) => type.element, {
    cascade: true
  })
  modules: ModuleToElementEntity[];

  /**
   * Some element can have a join table with a ordering specific
   */
  order?: number;
}

import {
  Column,
  JoinTable,
  Entity,
  ManyToOne,
  OneToMany,
  ManyToMany,
  BeforeInsert,
  BeforeUpdate
} from "typeorm";
import { UserEntity } from "./user.entity";
import { ContentEntity } from "./content.entity";
import { ModuleToElementEntity } from "./moduleToElement.entity";
import { TagEntity } from "./tag.entity";
import { slugify } from "../../../../../core/helpers/slugify";

@Entity("element")
export class ElementEntity extends ContentEntity {
  @Column()
  type: string;

  @Column({ nullable: true })
  name: string;

  @Column("text", { nullable: true })
  description?: string;

  @Column({ nullable: true })
  slug: string;

  @Column({ nullable: true })
  thumbnail?: string;

  @ManyToOne(() => UserEntity, (user) => user.elements)
  user: UserEntity;

  @Column("uuid", { nullable: true })
  userId?: string;

  @ManyToMany(() => TagEntity, (tag) => tag.elements, { eager: true })
  @JoinTable()
  tags?: TagEntity[];

  @OneToMany(() => ModuleToElementEntity, (type) => type.element, {
    cascade: true
  })
  modules: ModuleToElementEntity[];

  /**
   * Some element can have a join table with a ordering specific
   */
  order?: number;
}

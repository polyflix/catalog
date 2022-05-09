import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany
} from "typeorm";
import { ContentEntity } from "./content.entity";
import { CourseEntity } from "./course.entity";
import { UserEntity } from "./user.entity";
import { ModuleToElementEntity } from "./moduleToElement.entity";
import { slugify } from "../../../../../core/helpers/slugify";
import { PasswordEntity } from "./password.entity";

@Entity("module")
export class ModuleEntity extends ContentEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  @Index()
  slug: string;

  @Column("text")
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.modules)
  user?: UserEntity;

  @Column("uuid")
  userId?: string;

  @ManyToMany(() => CourseEntity, (course) => course.modules)
  courses?: CourseEntity[];

  @OneToMany(() => ModuleToElementEntity, (type) => type.module, {
    cascade: true
  })
  elements: ModuleToElementEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = slugify(this.name);
  }

  @OneToMany(() => PasswordEntity, (password) => password.module)
  passwords?: PasswordEntity[];
}

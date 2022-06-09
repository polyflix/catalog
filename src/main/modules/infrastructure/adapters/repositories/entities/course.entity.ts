import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne
} from "typeorm";
import { ModuleEntity } from "./module.entity";
import { MaxLength, MinLength } from "class-validator";
import { ContentEntity } from "./content.entity";
import { UserEntity } from "./user.entity";
import { CursusEntity } from "./cursus.entity";
import { slugify } from "../../../../../core/helpers/slugify";

@Entity("course")
export class CourseEntity extends ContentEntity {
  @Column()
  @MaxLength(64)
  @MinLength(8)
  name: string;

  @Column({ unique: true })
  @Index()
  slug: string;

  @Column("text")
  @MaxLength(256)
  @MinLength(1)
  description: string;

  @Column("text", { nullable: true })
  @MinLength(1)
  content: string;

  @Column("uuid")
  userId?: string;

  @ManyToOne(() => UserEntity, (user) => user.courses, {
    eager: true
  })
  user?: UserEntity;

  @ManyToMany(() => ModuleEntity, (module) => module.courses, {
    eager: true
  })
  @JoinTable()
  modules?: ModuleEntity[];

  @ManyToMany(() => CursusEntity, (cursus) => cursus.courses)
  cursus?: CursusEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = slugify(this.name);
  }
}

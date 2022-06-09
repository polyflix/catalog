import { slugify } from "../../../../../core/helpers/slugify";
import {
  Column,
  Entity,
  JoinTable,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  Index,
  BeforeInsert,
  BeforeUpdate
} from "typeorm";
import { ContentEntity } from "./content.entity";
import { CourseEntity } from "./course.entity";
import { UserEntity } from "./user.entity";

@Entity("cursus")
export class CursusEntity extends ContentEntity {
  @Column({ unique: true })
  @Index()
  slug: string;

  @Column()
  title: string;

  @Column("text")
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.cursus, {
    eager: true
  })
  @JoinColumn({ name: "userId" })
  user?: UserEntity;

  @Column("uuid")
  userId?: string;

  @ManyToMany(() => CourseEntity, (course) => course.cursus, {
    eager: true
  })
  @JoinTable()
  courses?: CourseEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = slugify(this.title);
  }
}

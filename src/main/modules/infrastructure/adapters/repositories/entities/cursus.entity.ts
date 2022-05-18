import {
  Column,
  Entity,
  JoinTable,
  JoinColumn,
  ManyToOne,
  ManyToMany
} from "typeorm";
import { ContentEntity } from "./content.entity";
import { CourseEntity } from "./course.entity";
import { UserEntity } from "./user.entity";

@Entity("cursus")
export class CursusEntity extends ContentEntity {
  @Column({ unique: true })
  slug: string;

  @Column({ unique: true })
  title: string;

  @Column("text")
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.cursus)
  @JoinColumn({ name: "userId" })
  user?: Promise<UserEntity>;

  @Column("uuid")
  userId?: string;

  @ManyToMany(() => CourseEntity, (course) => course.cursus)
  @JoinTable()
  courses?: CourseEntity[];
}

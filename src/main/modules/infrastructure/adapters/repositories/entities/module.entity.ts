import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany
} from "typeorm";
import { CourseEntity } from "./course.entity";
import { ModuleToElementEntity } from "./moduleToElement.entity";

@Entity("module")
export class ModuleEntity {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  title: string;

  @ManyToMany(() => CourseEntity, (course) => course.modules)
  courses?: CourseEntity[];

  @OneToMany(() => ModuleToElementEntity, (type) => type.module, {
    cascade: true
  })
  elements: ModuleToElementEntity[];
}

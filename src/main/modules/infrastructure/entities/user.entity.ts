import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { ElementEntity } from "./element.entity";
import { ModuleEntity } from "./module.entity";
import { CourseEntity } from "./course.entity";
import { CursusEntity } from "./cursus.entity";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => ModuleEntity, (module) => module.user, {
    nullable: true
  })
  modules?: ModuleEntity[];

  @OneToMany(() => CourseEntity, (course) => course.user)
  courses?: Promise<CourseEntity[]>;

  @OneToMany(() => CursusEntity, (cursus) => cursus.user)
  cursus?: Promise<CursusEntity[]>;

  @CreateDateColumn({
    type: "timestamp"
  })
  createdAt?: Date;

  @UpdateDateColumn({
    type: "timestamp"
  })
  updatedAt?: Date;

  @OneToMany(() => ElementEntity, (element) => element.user, {
    nullable: true
  })
  elements?: ElementEntity[];
}

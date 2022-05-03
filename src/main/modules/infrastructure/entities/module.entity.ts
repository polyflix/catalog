import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { ContentEntity } from "./content.entity";
import { CourseEntity } from "./course.entity";
import { UserEntity } from "./user.entity";
import { ModuleToElementEntity } from "./moduleToElement.entity";
import { ElementEntity } from "./element.entity";

@Entity("module")
export class ModuleEntity extends ContentEntity {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ unique: true })
  slug: string;

  @ApiProperty()
  @Column("text")
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.modules)
  user?: UserEntity;

  @ManyToMany(() => CourseEntity, (course) => course.modules)
  courses?: CourseEntity[];

  @OneToMany(() => ModuleToElementEntity, (type) => type.module, {
    cascade: true
  })
  elementToModule: ModuleToElementEntity[];

  elements?: ElementEntity[];

  //   @OneToMany(() => PasswordEntity, (password) => password.module)
  //   passwords?: PasswordEntity[];
}

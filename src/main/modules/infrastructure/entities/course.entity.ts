import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { ModuleEntity } from "./module.entity";
import { MaxLength, MinLength } from "class-validator";
import { ContentEntity } from "./content.entity";
import { UserEntity } from "./user.entity";
import { CursusEntity } from "./cursus.entity";

@Entity("course")
export class CourseEntity extends ContentEntity {
  @ApiProperty()
  @Column()
  @MaxLength(64)
  @MinLength(8)
  name: string;

  @ApiProperty()
  @Column({ unique: true })
  slug: string;

  @ApiProperty()
  @Column("text")
  @MaxLength(256)
  @MinLength(1)
  description: string;

  @Column("text", { nullable: true })
  @MinLength(1)
  content: string;

  @ManyToOne(() => UserEntity, (user) => user.courses)
  user?: UserEntity;

  @ManyToMany(() => ModuleEntity, (module) => module.courses)
  @JoinTable()
  modules?: ModuleEntity[];

  @ManyToMany(() => CursusEntity, (cursus) => cursus.courses)
  cursus?: CursusEntity[];
}

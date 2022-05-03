import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  JoinTable,
  Entity,
  ManyToOne,
  OneToMany,
  ManyToMany
} from "typeorm";
import { UserEntity } from "./user.entity";
import { ContentEntity } from "./content.entity";
import { ModuleToElementEntity } from "./moduleToElement.entity";
import { TagEntity } from "./tag.entity";

@Entity("element")
export class ElementEntity extends ContentEntity {
  @Column()
  type: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column("text", { nullable: true })
  description?: string;

  @Column({ unique: true })
  slug: string;

  @ApiProperty()
  @Column({ nullable: true })
  thumbnail?: string;

  @ManyToOne(() => UserEntity, (user) => user.elements)
  user: UserEntity;

  @ManyToMany(() => TagEntity, (tag) => tag.elements, { eager: true })
  @JoinTable()
  tags?: TagEntity[];

  @OneToMany(() => ModuleToElementEntity, (type) => type.element, {
    cascade: true
  })
  elementToModule: ModuleToElementEntity[];

  /**
   * Some element can have a join table with a ordering specific
   */
  order?: number;
}

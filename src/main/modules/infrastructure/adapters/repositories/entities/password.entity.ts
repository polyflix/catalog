import { Exclude, Expose } from "class-transformer";
import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { ModuleEntity } from "./module.entity";

@Entity("password")
export class PasswordEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: false })
  isRevoked: boolean;

  @Column({ type: "timestamptz", nullable: true })
  expiresAt?: Date;

  @Column()
  moduleId: string;

  @ManyToOne(() => ModuleEntity, (module) => module.passwords, {
    orphanedRowAction: "delete"
  })
  module: ModuleEntity;

  @Expose()
  get accessKey(): string {
    return Buffer.from(this.password).toString("base64");
  }
}

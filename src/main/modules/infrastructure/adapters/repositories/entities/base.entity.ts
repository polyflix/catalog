import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn
} from "typeorm";

/**
 * Base entity for our DB entities.
 * EVERY ENTITY SHOULD EXTENDS AT LEAST THIS ENTITY
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @VersionColumn({ default: 1 })
  __v?: number;
}

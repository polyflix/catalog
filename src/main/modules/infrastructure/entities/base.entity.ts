import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
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
  @ApiProperty({ required: false })
  @IsOptional({ always: true })
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @ApiProperty()
  @IsOptional({ always: true })
  @CreateDateColumn()
  createdAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional({ always: true })
  @UpdateDateColumn()
  updatedAt?: Date;

  @ApiProperty()
  @IsOptional({ always: true })
  @VersionColumn({ default: 1 })
  __v?: number;
}

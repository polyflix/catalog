import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, Matches } from "class-validator";
import { Visibility } from "../../../constants/content.enum";
import { Column } from "typeorm";
import { BaseEntity } from "./base.entity";

export class ContentEntity extends BaseEntity {
  @ApiProperty()
  @Matches(
    `^${Object.values(Visibility)
      .filter((v) => typeof v !== "number")
      .join("|")}$`,
    "i"
  )
  @IsOptional({ always: true })
  @Column({ enum: Visibility, type: "enum", default: Visibility.PUBLIC })
  visibility?: Visibility;

  @ApiProperty()
  @IsBoolean()
  @IsOptional({ always: true })
  @Column({ default: false })
  draft?: boolean;
}

import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min
} from "class-validator";

export class PaginationQuery {
  @IsInt()
  @Min(1)
  @Max(2147483647)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  pageSize?: number = 10;

  @IsString()
  @IsOptional()
  order?: string;
}

export class Paginate<T> {
  @IsArray()
  @ApiProperty()
  data: T[];

  @IsInt()
  @Min(1)
  @Max(2147483647)
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  pageSize?: number;

  @IsInt()
  @Min(1)
  @Max(2147483647)
  @IsOptional()
  @Type(() => Number)
  total?: number;
}

export class PaginationData<T> {
  data: T[];
  total: number;
}

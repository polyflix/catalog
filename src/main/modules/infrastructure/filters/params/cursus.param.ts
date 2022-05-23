import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { ToBoolean } from "../../../../core/types/dto.type";
import { Visibility } from "../../../../constants/content.enum";
import { PaginationQuery } from "../../../../core/types/pagination.type";

export const DefaultCursusParams: CursusParams = {
  page: 1,
  pageSize: 10,
  visibility: Visibility.PUBLIC
};

export class CursusParams extends PaginationQuery {
  @IsEnum(Visibility)
  @IsOptional()
  visibility?: Visibility;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  draft?: boolean;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  title?: string;
}

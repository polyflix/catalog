import { Injectable } from "@nestjs/common";
import { has } from "lodash";
import { Visibility } from "src/main/constants/content.enum";
import { SelectQueryBuilder } from "typeorm";
import { CourseEntity } from "../../adapters/repositories/entities/course.entity";
import { CourseParams } from "../params/course.param";

import { AbstractFilter } from "./abstract.filter";

@Injectable()
export class CourseFilter extends AbstractFilter<CourseEntity> {
  buildFilters(
    queryBuilder: SelectQueryBuilder<CourseEntity>,
    params: CourseParams,
    userId: string,
    isAdmin: boolean
  ): void {
    let isMe: boolean;
    if (has(params, "name")) {
      queryBuilder.andWhere("course.name = :name", { name: params.name });
    }

    if (has(params, "userId")) {
      isMe = userId === params?.userId;
      queryBuilder.andWhere("course.userId = :userId", {
        userId: params.userId
      });
    }

    if (isMe || isAdmin) {
      if (has(params, "visibility") || has(params, "draft")) {
        this.buildVisibilityFilters(
          queryBuilder,
          params.visibility,
          params.draft
        );
      }
    } else {
      this.buildVisibilityFilters(queryBuilder, Visibility.PUBLIC, false);
    }
  }

  buildPaginationAndSort(
    queryBuilder: SelectQueryBuilder<CourseEntity>,
    params: CourseParams
  ): void {
    this.paginate(queryBuilder, params.page, params.pageSize);

    this.order(
      "course",
      queryBuilder,
      has(params, "order") ? params.order : "name",
      ["name", "createdAt", "updatedAt"]
    );
  }

  private buildVisibilityFilters(
    queryBuilder: SelectQueryBuilder<CourseEntity>,
    visibility?: Visibility,
    draft?: boolean
  ) {
    if (visibility != null) {
      queryBuilder.andWhere("course.visibility = :visibility", {
        visibility
      });
    }
    if (draft != null) {
      queryBuilder.andWhere("course.draft = :draft", {
        draft
      });
    }
  }

  totalCount(
    queryBuilder: SelectQueryBuilder<CourseEntity>,
    params: CourseParams,
    me?: string,
    isAdmin?: boolean
  ): void {
    this.buildFilters(queryBuilder, params, me, isAdmin);
    queryBuilder.select("COUNT(DISTINCT course.id) AS total");
  }
}

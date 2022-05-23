import { Injectable } from "@nestjs/common";
import { has } from "lodash";
import { Visibility } from "src/main/constants/content.enum";
import { SelectQueryBuilder } from "typeorm";
import { CursusEntity } from "../../adapters/repositories/entities/cursus.entity";
import { CursusParams } from "../params/cursus.param";

import { AbstractFilter } from "./abstract.filter";

@Injectable()
export class CursusFilter extends AbstractFilter<CursusEntity> {
  buildFilters(
    queryBuilder: SelectQueryBuilder<CursusEntity>,
    params: CursusParams,
    userId: string,
    isAdmin: boolean
  ): void {
    let isMe: boolean;
    if (has(params, "title")) {
      queryBuilder.andWhere("cursus.title = :title", { title: params.title });
    }

    if (has(params, "userId")) {
      isMe = userId === params?.userId;
      queryBuilder.andWhere("cursus.userId = :userId", {
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
    queryBuilder: SelectQueryBuilder<CursusEntity>,
    params: CursusParams
  ): void {
    this.paginate(queryBuilder, params.page, params.pageSize);

    this.order(
      "cursus",
      queryBuilder,
      has(params, "order") ? params.order : "title",
      ["title", "createdAt", "updatedAt"]
    );
  }

  private buildVisibilityFilters(
    queryBuilder: SelectQueryBuilder<CursusEntity>,
    visibility?: Visibility,
    draft?: boolean
  ) {
    if (visibility != null) {
      queryBuilder.andWhere("cursus.visibility = :visibility", {
        visibility
      });
    }
    if (draft != null) {
      queryBuilder.andWhere("cursus.draft = :draft", {
        draft
      });
    }
  }
}

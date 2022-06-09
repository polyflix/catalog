import { Injectable } from "@nestjs/common";
import { has } from "lodash";
import { Visibility } from "src/main/constants/content.enum";
import { SelectQueryBuilder } from "typeorm";
import { ModuleEntity } from "../../adapters/repositories/entities/module.entity";
import { ModuleParams } from "../params/module.param";
import { AbstractFilter } from "./abstract.filter";

@Injectable()
export class ModuleFilter extends AbstractFilter<ModuleEntity> {
  buildFilters(
    queryBuilder: SelectQueryBuilder<ModuleEntity>,
    params: ModuleParams,
    userId: string,
    isAdmin: boolean
  ): void {
    let isMe: boolean;
    if (has(params, "name")) {
      queryBuilder.andWhere("module.name = :name", { name: params.name });
    }

    if (has(params, "userId")) {
      isMe = userId === params?.userId;
      queryBuilder.andWhere("module.userId = :userId", {
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
    queryBuilder: SelectQueryBuilder<ModuleEntity>,
    params: ModuleParams
  ): void {
    this.paginate(queryBuilder, params.page, params.pageSize);

    this.order(
      "module",
      queryBuilder,
      has(params, "order") ? params.order : "name",
      ["name", "createdAt", "updatedAt"]
    );
  }

  private buildVisibilityFilters(
    queryBuilder: SelectQueryBuilder<ModuleEntity>,
    visibility?: Visibility,
    draft?: boolean
  ) {
    if (visibility != null) {
      queryBuilder.andWhere("module.visibility = :visibility", {
        visibility
      });
    }
    if (draft != null) {
      queryBuilder.andWhere("module.draft = :draft", {
        draft
      });
    }
  }

  totalCount(
    queryBuilder: SelectQueryBuilder<ModuleEntity>,
    params: ModuleParams,
    me?: string,
    isAdmin?: boolean
  ): void {
    this.buildFilters(queryBuilder, params, me, isAdmin);
    queryBuilder.select("COUNT(DISTINCT module.id) AS total");
  }
}

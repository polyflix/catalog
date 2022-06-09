import { BadRequestException } from "@nestjs/common";
import { SelectQueryBuilder } from "typeorm";

export enum SortingTypeEnum {
  ASC = "ASC",
  DESC = "DESC"
}

export abstract class AbstractFilter<ENTITY> {
  protected readonly DEFAULT_PAGINATED_QUERY_PAGESIZE = 10;
  abstract buildFilters(
    queryBuilder: SelectQueryBuilder<ENTITY>,
    params: any,
    userId: string,
    isAdmin: boolean
  ): void;

  protected andWhereInStatement(
    queryBuilder: SelectQueryBuilder<ENTITY>,
    filters: {
      entityProperty: string;
      namedParamName: string;
      params?: string[] | number[] | string | number;
    }
  ): void {
    const param = {};
    param[filters.namedParamName] = filters.params;
    if (filters.params) {
      queryBuilder.andWhere(
        `${filters.entityProperty} IN (:...${filters.namedParamName})`,
        param
      );
    }
  }

  protected andWhereLikeStatement(
    queryBuilder: SelectQueryBuilder<ENTITY>,
    filters: {
      entityProperty: string;
      namedParamName: string;
      param?: string;
    }
  ) {
    if (filters.param) {
      const whereObjectParameter = {};
      whereObjectParameter[filters.namedParamName] = `%${filters.param}%`;
      queryBuilder.andWhere(
        `${filters.entityProperty} LIKE :${filters.namedParamName}`,
        whereObjectParameter
      );
    }
  }

  /**
   * Add ordering options to the queryBuilder
   *
   * If the inputCriteria begins with `-`, the ordering is in DESC, otherwise ASC
   * @param entityName
   * @param queryBuilder
   * @param inputCriteria
   * @param possibleOrderingValues
   * @protected
   */
  protected order(
    entityName: string,
    queryBuilder: SelectQueryBuilder<ENTITY>,
    inputCriteria: string,
    possibleOrderingValues: string[]
  ): void {
    const order: string = inputCriteria.substring(0, 1).replace(/\s/g, "");
    if (order === "-") {
      const criteria = inputCriteria.substring(1, inputCriteria.length);
      if (possibleOrderingValues.includes(criteria)) {
        this.orderBy(
          queryBuilder,
          `${entityName}.${criteria}`,
          SortingTypeEnum.DESC
        );
      } else {
        throw new BadRequestException(
          criteria + " is not a possible ordering option."
        );
      }
    } else {
      if (possibleOrderingValues.includes(inputCriteria)) {
        this.orderBy(
          queryBuilder,
          `${entityName}.${inputCriteria}`,
          SortingTypeEnum.ASC
        );
      } else {
        throw new BadRequestException(
          inputCriteria + " is not a possible ordering option."
        );
      }
    }
  }

  protected paginate(
    queryBuilder: SelectQueryBuilder<ENTITY>,
    page: number,
    pageSize = this.DEFAULT_PAGINATED_QUERY_PAGESIZE
  ): void {
    if (!pageSize) pageSize = this.DEFAULT_PAGINATED_QUERY_PAGESIZE;
    queryBuilder.take(pageSize);
    queryBuilder.skip(((page || 1) - 1) * pageSize);
  }

  protected stringArrayToNumber(values: string[]): number[] {
    return values.map((value: string) => +value);
  }

  // abstract totalCount(
  //   queryBuilder: SelectQueryBuilder<ENTITY>,
  //   params: any
  // ): void;

  private orderBy(
    queryBuilder: SelectQueryBuilder<ENTITY>,
    propertyName: string,
    order: SortingTypeEnum
  ): void {
    if (propertyName) {
      queryBuilder.addOrderBy(propertyName, order);
    }
  }
}

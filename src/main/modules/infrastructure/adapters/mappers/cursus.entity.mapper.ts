import { Injectable } from "@nestjs/common";
import { AbstractMapper } from "../../../../core/helpers/abstract.mapper";
import { Cursus, CursusProps } from "../../../domain/models/cursus.model";
import { CursusEntity } from "../repositories/entities/cursus.entity";
import { CourseEntityMapper } from "./course.entity.mapper";
import { UserEntityMapper } from "./user.entity.mapper";

@Injectable()
export class CursusEntityMapper extends AbstractMapper<CursusEntity, Cursus> {
  constructor(
    private readonly courseEntityMapper: CourseEntityMapper,
    private readonly userEntityMapper: UserEntityMapper
  ) {
    super();
  }

  apiToEntity(apiModel: Cursus): CursusEntity {
    const entity = new CursusEntity();
    Object.assign(entity, apiModel);
    return entity;
  }

  entityToApi(entity: CursusEntity): Cursus {
    const cursusProps: CursusProps = {
      title: entity.title,
      slug: entity.slug,
      description: entity.description,
      courses: this.courseEntityMapper.entitiesToApis(entity.courses || []),
      user: this.userEntityMapper.entityToApi(entity.user)
    };

    const cursus = Cursus.create(cursusProps);

    Object.assign(cursus, entity);
    return cursus;
  }
}

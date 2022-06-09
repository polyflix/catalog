import { Injectable } from "@nestjs/common";
import { AbstractMapper } from "../../../../core/helpers/abstract.mapper";
import { Course, CourseProps } from "../../../domain/models/course.model";
import { CourseEntity } from "../repositories/entities/course.entity";
import { ModuleEntityMapper } from "./module.entity.mapper";
import { UserEntityMapper } from "./user.entity.mapper";

@Injectable()
export class CourseEntityMapper extends AbstractMapper<CourseEntity, Course> {
  constructor(
    private readonly moduleEntityMapper: ModuleEntityMapper,
    private readonly userEntityMapper: UserEntityMapper
  ) {
    super();
  }

  apiToEntity(apiModel: Course): CourseEntity {
    const entity = new CourseEntity();
    Object.assign(entity, apiModel);
    return entity;
  }

  entityToApi(entity: CourseEntity): Course {
    const courseProps: CourseProps = {
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      content: entity.content,
      modules: this.moduleEntityMapper.entitiesToApis(entity.modules || []),
      user: entity.user ? this.userEntityMapper.entityToApi(entity.user) : null
    };

    const course = Course.create(courseProps);

    Object.assign(course, entity);
    return course;
  }
}

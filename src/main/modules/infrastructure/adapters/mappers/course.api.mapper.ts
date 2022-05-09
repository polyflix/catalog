import { Injectable } from "@nestjs/common";
import {
  CreateCourseDto,
  CourseResponse
} from "../../../application/dto/course.dto";
import { Course, CourseProps } from "../../../domain/models/course.model";

@Injectable()
export class CourseApiMapper {
  apiToEntity(apiModel: CreateCourseDto): Course {
    return Course.create(Object.assign(new CourseProps(), apiModel));
  }

  entityToApi(entity: Course): CourseResponse {
    const course = new CourseResponse();
    Object.assign(course, entity);
    return course;
  }
}

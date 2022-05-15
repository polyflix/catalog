import { Controller, Delete, Get, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Course")
@Controller("courses")
export class CourseController {
  @Get()
  findAll(): string {
    return "This action returns all courses";
  }

  @Get("/:slug")
  findOne(): string {
    return "This action returns a single course";
  }

  @Put("/:slug")
  update(): string {
    return "This action updates a course";
  }

  @Post()
  create(): string {
    return "This action creates a course";
  }

  @Delete("/:slug")
  delete(): string {
    return "This action deletes a course";
  }
}

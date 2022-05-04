import { Module } from "@nestjs/common";
import { ModuleController } from "./controllers/module.controller";
import { CursusController } from "./controllers/cursus.controller";
import { CourseController } from "./controllers/course.controller";

@Module({
  imports: [],
  controllers: [ModuleController, CursusController, CourseController],
  providers: [],
  exports: []
})
export class MainModule {}

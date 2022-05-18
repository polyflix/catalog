import { Module } from "@nestjs/common";
import { ModuleController } from "./controllers/module.controller";
import { CursusController } from "./controllers/cursus.controller";
import { CourseController } from "./controllers/course.controller";
import { ModuleService } from "./services/module.service";
import { PsqlModuleRepository } from "./adapters/repositories/psql-module.repository";
import { ModuleFilter } from "./filters/filters/module.filter";
import { ModuleApiMapper } from "./adapters/mappers/module.api.mapper";
import { ModuleEntityMapper } from "./adapters/mappers/module.entity.mapper";
import { ModuleRepository } from "../domain/ports/repositories/module.repository";
import { ModuleEntity } from "./adapters/repositories/entities/module.entity";
import { UserEntity } from "./adapters/repositories/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourseEntity } from "./adapters/repositories/entities/course.entity";
import { CursusEntity } from "./adapters/repositories/entities/cursus.entity";
import { ElementEntity } from "./adapters/repositories/entities/element.entity";
import { TagEntity } from "./adapters/repositories/entities/tag.entity";
import { ModuleToElementEntity } from "./adapters/repositories/entities/moduleToElement.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ModuleEntity,
      UserEntity,
      CourseEntity,
      CursusEntity,
      ElementEntity,
      TagEntity,
      ModuleToElementEntity
    ])
  ],
  controllers: [ModuleController, CursusController, CourseController],
  providers: [
    ModuleService,
    PsqlModuleRepository,
    ModuleFilter,
    ModuleApiMapper,
    ModuleEntityMapper,
    { provide: ModuleRepository, useClass: PsqlModuleRepository }
  ],
  exports: []
})
export class MainModule {}

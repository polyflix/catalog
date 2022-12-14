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
import { CourseService } from "./services/course.service";
import { PsqlCourseRepository } from "./adapters/repositories/psql-course.repository";
import { CourseApiMapper } from "./adapters/mappers/course.api.mapper";
import { CourseEntityMapper } from "./adapters/mappers/course.entity.mapper";
import { CourseFilter } from "./filters/filters/course.filter";
import { CursusService } from "./services/cursus.service";
import { PsqlCursusRepository } from "./adapters/repositories/psql-cursus.repository";
import { CursusFilter } from "./filters/filters/cursus.filter";
import { CursusApiMapper } from "./adapters/mappers/cursus.api.mapper";
import { CursusEntityMapper } from "./adapters/mappers/cursus.entity.mapper";
import { UserController } from "./controllers/events/user.controller";
import { UserService } from "./services/user.service";
import { UserApiMapper } from "./adapters/mappers/user.api.mapper";
import { UserEntityMapper } from "./adapters/mappers/user.entity.mapper";
import { PsqlUserRepository } from "./adapters/repositories/psql-user.repository";
import { UserRepository } from "../domain/ports/repositories/user.repository";
import { ElementController } from "./controllers/events/element.controller";
import { ElementService } from "./services/element.service";
import { PsqlElementRepository } from "./adapters/repositories/psql-element.repository";
import { ElementApiMapper } from "./adapters/mappers/element.api.mapper";
import { ElementEntityMapper } from "./adapters/mappers/element.entity.mapper";
import { ElementRepository } from "../domain/ports/repositories/element.repository";
import { PasswordService } from "./services/password.service";
import { PsqlPasswordRepository } from "./adapters/repositories/psql-password.repository";
import { PasswordRepository } from "../domain/ports/repositories/password.repository";
import { PasswordEntity } from "./adapters/repositories/entities/password.entity";
import { PasswordEntityMapper } from "./adapters/mappers/password.entity.mapper";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ModuleEntity,
      UserEntity,
      ElementEntity,
      CourseEntity,
      CursusEntity,
      ElementEntity,
      TagEntity,
      ModuleToElementEntity,
      PasswordEntity
    ])
  ],
  controllers: [
    ModuleController,
    CursusController,
    CourseController,
    UserController,
    ElementController
  ],
  providers: [
    PasswordService,
    ModuleService,
    CourseService,
    CursusService,
    UserService,
    ElementService,
    PsqlPasswordRepository,
    PsqlModuleRepository,
    PsqlCourseRepository,
    PsqlCursusRepository,
    PsqlUserRepository,
    PsqlElementRepository,
    CursusFilter,
    ModuleFilter,
    CourseFilter,
    CursusApiMapper,
    CursusEntityMapper,
    UserApiMapper,
    UserEntityMapper,
    ElementApiMapper,
    ElementEntityMapper,
    ModuleApiMapper,
    ModuleEntityMapper,
    CourseApiMapper,
    CourseEntityMapper,
    PasswordEntityMapper,
    { provide: ModuleRepository, useClass: PsqlModuleRepository },
    { provide: UserRepository, useClass: PsqlUserRepository },
    { provide: ElementRepository, useClass: PsqlElementRepository }
  ],
  exports: []
})
export class MainModule {}

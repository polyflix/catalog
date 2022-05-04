import { Controller, Delete, Get, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Module")
@Controller("module")
export class ModuleController {
  @Get()
  findAll(): string {
    return "This action returns all modules";
  }

  @Get("/:slug")
  findOne(): string {
    return "This action returns a single module";
  }

  @Put("/:slug")
  update(): string {
    return "This action updates a module";
  }

  @Post()
  create(): string {
    return "This action creates a module";
  }

  @Delete("/:slug")
  delete(): string {
    return "This action deletes a module";
  }
}

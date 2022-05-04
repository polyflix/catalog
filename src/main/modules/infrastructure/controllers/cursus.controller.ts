import { Controller, Delete, Get, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Cursus")
@Controller("cursus")
export class CursusController {
  @Get()
  findAll(): string {
    return "This action returns all cursus";
  }

  @Get("/:slug")
  findOne(): string {
    return "This action returns a single cursus";
  }

  @Put("/:slug")
  update(): string {
    return "This action updates a cursus";
  }

  @Post()
  create(): string {
    return "This action creates a cursus";
  }

  @Delete("/:slug")
  delete(): string {
    return "This action deletes a cursus";
  }
}

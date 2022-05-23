import { Logger } from "@nestjs/common";
import { Option, Result } from "@swan-io/boxed";
import { CursusParams } from "src/main/modules/infrastructure/filters/params/cursus.param";
import { Cursus } from "../../models/cursus.model";

export abstract class CursusRepository {
  protected readonly logger = new Logger(this.constructor.name);

  abstract findAll(
    params: CursusParams,
    userId: string,
    isAdmin: boolean
  ): Promise<Option<Cursus[]>>;

  abstract findOne(slug: string): Promise<Option<Cursus>>;

  abstract create(cursus: Cursus): Promise<Result<Cursus, Error>>;

  abstract update(
    slug: string,
    cursus: Cursus
  ): Promise<Option<Partial<Cursus>>>;
}

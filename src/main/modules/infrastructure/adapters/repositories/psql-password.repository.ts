import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PasswordRepository } from "../../../domain/ports/repositories/password.repository";
import { Password } from "src/main/modules/domain/models/password.model";
import { PasswordEntity } from "./entities/password.entity";
import { PasswordEntityMapper } from "../mappers/password.entity.mapper";
import { Option } from "@swan-io/boxed";

@Injectable()
export class PsqlPasswordRepository extends PasswordRepository {
  constructor(
    @InjectRepository(PasswordEntity)
    private readonly passwordRepo: Repository<PasswordEntity>,
    private readonly passwordEntityMapper: PasswordEntityMapper
  ) {
    super();
  }

  async findOne(
    moduleId: string,
    accessKey?: string
  ): Promise<Option<Password>> {
    try {
      const result = await this.passwordRepo.findOne({
        where: {
          moduleId: moduleId,
          password: Buffer.from(accessKey, "base64").toString("utf8")
        }
      });
      if (result) {
        return Option.Some(this.passwordEntityMapper.entityToApi(result));
      }
      return Option.None();
    } catch (e) {
      return Option.None();
    }
  }

  async revoke(password: Password): Promise<void> {
    await this.passwordRepo.update(password.id, { isRevoked: true });
  }

  async create(password: Password): Promise<Password> {
    await this.passwordRepo.save(
      this.passwordEntityMapper.apiToEntity(password)
    );
    return password;
  }
}

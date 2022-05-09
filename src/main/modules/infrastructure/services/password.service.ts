import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Option } from "@swan-io/boxed";
import { Password } from "../../domain/models/password.model";
import { PsqlPasswordRepository } from "../adapters/repositories/psql-password.repository";

@Injectable()
export class PasswordService {
  protected readonly logger = new Logger(PasswordService.name);
  constructor(
    private readonly psqlPasswordRepository: PsqlPasswordRepository
  ) {}

  async findOne(
    moduleEntityId: string,
    accessKey: string
  ): Promise<Option<Password>> {
    const module = await this.psqlPasswordRepository.findOne(
      moduleEntityId,
      accessKey
    );
    return module;
  }
  async revoke(password: Password): Promise<void> {
    return this.psqlPasswordRepository.revoke(password);
  }

  async create(password: Password, moduleId: string): Promise<Password> {
    password.moduleId = moduleId;
    return this.psqlPasswordRepository.create(password);
  }
}

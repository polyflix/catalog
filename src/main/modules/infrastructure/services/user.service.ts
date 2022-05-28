import { Injectable } from "@nestjs/common";
import { UserDto } from "../../application/dto/user.dto";
import { UserRepository } from "../../domain/ports/repositories/user.repository";
import { UserApiMapper } from "../adapters/mappers/user.api.mapper";

@Injectable()
export class UserService {
  constructor(
    private readonly userApiMapper: UserApiMapper,
    private readonly userRepository: UserRepository
  ) {}

  async updateUser(user: UserDto): Promise<void> {
    await this.userRepository.update(user.id, user);
  }

  async createUser(user: UserDto): Promise<void> {
    await this.userRepository.create(user);
  }

  async deleteUser(user: UserDto): Promise<void> {
    await this.userRepository.delete(user);
  }
}

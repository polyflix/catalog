import { ClientKafka, EventPattern, Payload } from "@nestjs/microservices";
import { Controller, Logger } from "@nestjs/common";
import {
  InjectKafkaClient,
  PolyflixKafkaValue,
  TriggerType
} from "@polyflix/x-utils";
import { UserService } from "../../services/user.service";
import { UserDto } from "src/main/modules/application/dto/user.dto";
import { KAFKA_USER_TOPIC } from "src/main/constants/kafka.topics";

interface PolyflixCustomKafkaValue extends PolyflixKafkaValue {
  fields: any;
}

@Controller()
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    @InjectKafkaClient() private readonly kafkaClient: ClientKafka,
    private readonly userService: UserService
  ) {}

  @EventPattern(KAFKA_USER_TOPIC)
  async process(@Payload("value") message: PolyflixCustomKafkaValue) {
    console.log("trigger user event ");
    const payload = message.fields;
    this.logger.log(
      `Receive message from topic: ${KAFKA_USER_TOPIC} - trigger: ${message.trigger}`
    );
    const user: UserDto = Object.assign(new UserDto(), payload);
    switch (message.trigger) {
      case TriggerType.UPDATE:
        await this.userService.updateUser(user);
        break;
      case TriggerType.CREATE:
        await this.userService.createUser(user);
        break;
      case TriggerType.DELETE:
        await this.userService.deleteUser(user);
        break;
    }
  }
}

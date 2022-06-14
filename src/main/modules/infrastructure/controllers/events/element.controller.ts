import { ClientKafka, EventPattern, Payload } from "@nestjs/microservices";
import { Controller, Logger } from "@nestjs/common";
import {
  InjectKafkaClient,
  PolyflixKafkaValue,
  TriggerType
} from "@polyflix/x-utils";
import {
  KAFKA_ATTACHMENT_TOPIC,
  KAFKA_QUIZZ_TOPIC,
  KAFKA_VIDEO_TOPIC
} from "src/main/constants/kafka.topics";
import { ElementDto } from "src/main/modules/application/dto/element.dto";
import { ElementService } from "../../services/element.service";
import { ElementApiMapper } from "../../adapters/mappers/element.api.mapper";

@Controller()
export class ElementController {
  private readonly logger = new Logger(ElementController.name);

  constructor(
    @InjectKafkaClient() private readonly kafkaClient: ClientKafka,
    private readonly elementService: ElementService,
    private readonly elementApiMapper: ElementApiMapper
  ) {}

  @EventPattern(KAFKA_VIDEO_TOPIC)
  async video(@Payload("value") message: PolyflixKafkaValue) {
    this.logger.log(
      `Recieve message from topic: ${KAFKA_VIDEO_TOPIC} - trigger: ${message.trigger}`
    );
    message.payload.type = "video";
    const element = this.elementApiMapper.apiToEntity(message.payload);
    switch (message.trigger) {
      case TriggerType.CREATE:
        this.elementService.create(element);
        break;
      case TriggerType.UPDATE:
        this.elementService.update(element);
        break;
      case TriggerType.DELETE:
        this.elementService.delete(element);
        break;
    }
  }

  @EventPattern(KAFKA_QUIZZ_TOPIC)
  async quizz(@Payload("value") message: PolyflixKafkaValue) {
    this.logger.log(
      `Recieve message from topic: ${KAFKA_QUIZZ_TOPIC} - trigger: ${message.trigger}`
    );
    message.payload.type = "quizz";
    const element = this.elementApiMapper.apiToEntity(message.payload);

    switch (message.trigger) {
      case TriggerType.CREATE:
        this.elementService.create(element);
        break;
      case TriggerType.UPDATE:
        this.elementService.update(element);
        break;
      case TriggerType.DELETE:
        this.elementService.delete(element);
        break;
    }
  }

  @EventPattern(KAFKA_ATTACHMENT_TOPIC)
  async attachment(@Payload("value") message: PolyflixKafkaValue) {
    this.logger.log(
      `Recieve message from topic: ${KAFKA_ATTACHMENT_TOPIC} - trigger: ${message.trigger}`
    );
    message.payload.type = "attachment";
    const element = this.elementApiMapper.apiToEntity(message.payload);

    switch (message.trigger) {
      case TriggerType.CREATE:
        this.elementService.create(element);
        break;
      case TriggerType.UPDATE:
        this.elementService.update(element);
        break;
      case TriggerType.DELETE:
        this.elementService.delete(element);
        break;
    }
  }
}

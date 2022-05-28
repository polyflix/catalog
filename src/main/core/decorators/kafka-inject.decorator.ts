import { Inject } from "@nestjs/common";
import { KAFKA_CLIENT } from "@polyflix/x-utils";

export const InjectKafkaClient = () => {
  return Inject(KAFKA_CLIENT);
};

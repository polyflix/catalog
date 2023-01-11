import { RequestMethod, ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { kafkaConfig } from "@polyflix/x-utils";
import { loadConfiguration } from "./config/loader.config";
import { logger } from "./config/logger.config";
import { configureOTel } from "./config/tracing.config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const config = loadConfiguration(logger);

  // Must be started before NestFactory
  const telemetry = configureOTel(config, logger);
  await telemetry.start();

  // Gracefully shutdown OTel data, it ensures that all data
  // has been dispatched before shutting down the server
  process.on("SIGTERM", () => {
    telemetry.shutdown().finally(() => process.exit(0));
  });

  const app = await NestFactory.create(AppModule.bootstrap({ config }), {
    logger
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "3"
  });

  app.useGlobalPipes(new ValidationPipe());

  const configOpenApi = new DocumentBuilder()
    .setTitle("Polyflix Catalog service API")
    .setDescription("Polyflix Catalog service API OpenAPI document.")
    .setVersion("3")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, configOpenApi, {
    operationIdFactory: (controllerKey: string, methodKey: string) => {
      return `${controllerKey.toLowerCase()}-${methodKey.toLowerCase()}`;
    }
  });
  SwaggerModule.setup("catalog/docs", app, document, {
    customSiteTitle: "Polyflix Catalog service API"
  });

  const port = config["server"]["port"] || 3000;
  app.connectMicroservice(kafkaConfig(config["kafka"]));
  app.startAllMicroservices();

  await app.listen(port, () => {
    logger.log(`Server listening on port ${port}`, "NestApplication");
  });
}

bootstrap();

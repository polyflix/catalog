import { RequestMethod, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { loadConfiguration } from "./config/loader.config";
import { logger } from "./config/logger.config";
import { configureOTel } from "./config/tracing.config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const config = loadConfiguration(logger);

  // Must be started before NestFactory
  const telemetry = configureOTel(config, logger);
  telemetry.start();

  // Gracefully shutdown OTel data, it ensures that all data
  // has been dispatched before shutting down the server
  process.on("SIGTERM", () => {
    telemetry.shutdown().finally(() => process.exit(0));
  });

  const app = await NestFactory.create(AppModule.bootstrap({ config }), {
    logger
  });

  await app.startAllMicroservices();

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix("/api/v2", {
    exclude: [{ path: "health", method: RequestMethod.GET }]
  });

  const configOpenApi = new DocumentBuilder()
    .setTitle("Polyflix API")
    .setDescription("Polyflix API OpenAPI document.")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, configOpenApi, {
    operationIdFactory: (controllerKey: string, methodKey: string) => {
      return `${controllerKey.toLowerCase()}-${methodKey.toLowerCase()}`;
    }
  });
  SwaggerModule.setup("api/v[1-2]/docs", app, document, {
    customSiteTitle: "Polyflix API"
  });

  const port = config["server"]["port"] || 3000;
  await app.listen(port, () => {
    logger.log(`Server listening on port ${port}`, "NestApplication");
  });
}

bootstrap();

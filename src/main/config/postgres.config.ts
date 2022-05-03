import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { writeFileSync } from "fs";
import { resolve } from "path";
import { EnvironmentsEnum } from "../constants/environments-enum";
import { MinioModuleOptions } from "@svtslv/nestjs-minio";
import { ClientProviderOptions, Transport } from "@nestjs/microservices";
import { parseInt } from "lodash";
import { DITokens } from "../constants/token.di";

export const DEV_MODE = process.env.NODE_ENV === EnvironmentsEnum.DEV;
export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;

export const getConfigurationForTypeORM = (
  configService: ConfigService
): TypeOrmModuleOptions => {
  const config: TypeOrmModuleOptions = {
    type: "postgres",
    url: configService.get<string>("POSTGRES_URL"),
    entities: ["dist/**/*.entity.js"],
    subscribers: [],
    migrationsTableName: "migrations",
    logging: configService.get("SQL_DEBUG") === "true",
    cli: {
      migrationsDir: "src/database/postgresql/migrations"
    },
    synchronize: false
  };

  // Write TypeORM json config
  const path = resolve("ormconfig.json");
  writeFileSync(
    path,
    JSON.stringify({
      ...config,
      entities: ["src/**/*.entity.ts"],
      migrations: ["src/database/postgresql/migrations/*.ts"]
    })
  );

  return config;
};

export const getConfigurationForMinIO = (
  configService: ConfigService
): MinioModuleOptions => {
  const portStr = configService.get<string>("MINIO_PORT");
  const useSSLStr = configService.get<string>("MINIO_SSL");

  const port = portStr ? parseInt(portStr) : 9000;
  const useSSL = useSSLStr ? useSSLStr === "true" : false;
  return {
    config: {
      port: port,
      endPoint: configService.get<string>("MINIO_ENDPOINT") ?? "localhost",
      accessKey: configService.get<string>("MINIO_ACCESS_KEY"),
      secretKey: configService.get<string>("MINIO_SECRET_KEY"),
      useSSL: useSSL
    }
  };
};

export const getConfigurationForKafka = (
  configService: ConfigService
): ClientProviderOptions => {
  const broker_ip = configService.get<string>("KAFKA_BROKER_IP") ?? "localhost";
  const broker_port = configService.get<string>("KAFKA_BROKER_PORT") ?? "9092";
  return {
    name: DITokens.LEGACY_KAFKA,
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: configService.get<string>("MY_POD_NAME") ?? "backend1",
        brokers: [`${broker_ip}:${broker_port}`]
      }
    }
  };
};

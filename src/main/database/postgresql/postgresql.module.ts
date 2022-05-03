import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { getConfigurationForTypeORM } from "../../config/postgres.config";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: getConfigurationForTypeORM
    })
  ],
})
export class PostgreSQLModule {}

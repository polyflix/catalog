import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { PostgreSQLModule } from './postgresql/postgresql.module';
import { SeedService } from './postgresql/seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.local' }),
    PostgreSQLModule,
  ],
})
class AppModule {}

async function bootstrap() {
  const logger = new Logger('App-seed');
  const context = await NestFactory.createApplicationContext(AppModule);
  const seedService = context.get(SeedService);
  const configService = context.get(ConfigService);

  try {
    if (configService.get<boolean>('SEED')) {
      await seedService.seed();
    }
    if (configService.get<boolean>('WIPE')) {
      await seedService.wipe();
    }
  } catch (error) {
    logger.error('Seed failed !', error);
  }

  context.close();
}
bootstrap();

import { Controller, Get, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator
} from "@nestjs/terminus";
import { ApiTags } from "@nestjs/swagger";

/**
 * Export service readiness/liveness
 * More info: https://docs.nestjs.com/recipes/terminus
 */
@ApiTags("HealthCheck")
@Controller("health")
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    private health: HealthCheckService,
    private httpIndicator: HttpHealthIndicator,
    private configService: ConfigService
  ) {}

  @Get()
  @HealthCheck()
  check() {
    this.logger.log(`Check my service health`);
    const serviceEndpoint: string = this.configService.get<string>(
      "service.to.check.endpoint"
    );

    return this.health.check([
      () => this.httpIndicator.pingCheck("myService", serviceEndpoint)
    ]);
  }
}

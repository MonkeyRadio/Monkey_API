import { Controller, Get } from "@nestjs/common";
import { HealthCheckService } from "./health-check.service";
import { HealthError } from "./health-error.error";

@Controller("health-check")
export class HealthCheckController {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @Get()
  public async checkHealth() {
    try {
      await this.healthCheckService.checkRedisHealth();
      await this.healthCheckService.checkDatabaseHealth();

      return {
        status: 200,
        message: "OK",
      };
    } catch (error) {
      if (error instanceof HealthError) return error.toResponse();
      else
        return {
          status: 500,
          message: error.message,
        };
    }
  }
}

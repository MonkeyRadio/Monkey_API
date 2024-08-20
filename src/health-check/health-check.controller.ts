import { Controller, Get, InternalServerErrorException } from "@nestjs/common";
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
      if (error instanceof HealthError)
        throw new InternalServerErrorException(error.toResponse());
      else
        throw new InternalServerErrorException({
          status: 500,
          message: error.message,
        });
    }
  }
}

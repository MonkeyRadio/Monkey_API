import { Module } from "@nestjs/common";
import { HealthCheckService } from "./health-check.service";
import { HealthCheckController } from "./health-check.controller";
import { MongooseHealthIndicator } from "@nestjs/terminus";

@Module({
  controllers: [HealthCheckController],
  providers: [HealthCheckService, MongooseHealthIndicator],
})
export class HealthCheckModule {}

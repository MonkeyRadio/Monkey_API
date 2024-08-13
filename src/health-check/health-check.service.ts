import { Injectable } from "@nestjs/common";
import { InjectRedis } from "@songkeys/nestjs-redis";
import Redis from "ioredis";
import { HealthError } from "./health-error.error";
import { MongooseHealthIndicator } from "@nestjs/terminus";

@Injectable()
export class HealthCheckService {
  constructor(
    private mongooseHealth: MongooseHealthIndicator,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  public async checkRedisHealth() {
    try {
      const ping = await this.redis.ping();
      if (ping !== "PONG") throw new HealthError("Redis", "Ping failed");
    } catch (error) {
      throw new HealthError("Redis", error.message);
    }
  }

  public async checkDatabaseHealth() {
    try {
      const ping = await this.mongooseHealth.pingCheck("mongodb");
      if (ping.mongodb.status != "up")
        throw new HealthError("Database", "Ping failed");
    } catch (error) {
      throw new HealthError("Database", error.message);
    }
  }
}

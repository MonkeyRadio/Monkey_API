import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { RedisModule } from "@songkeys/nestjs-redis";
import { AuthModule } from "./auth/auth.module";
import { RadioModule } from "./radio/radio.module";
import { AppController } from "./app.controller";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`,
      { dbName: process.env.MONGO_DB as string },
    ),
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT as string),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    AuthModule,
    RadioModule,
  ],
  controllers: [
    AppController,
  ],
})
export class AppModule {}

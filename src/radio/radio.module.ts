import { Module } from "@nestjs/common";
import { RadioService } from "./radio.service";
import { RadioController } from "./radio.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { UserSchema } from "@/schemas/user.schema";
import { RadioSchema } from "@/schemas/radio.schema";
import { LiveModule } from './live/live.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: "User",
        schema: UserSchema,
      },
      {
        name: "Radio",
        schema: RadioSchema,
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "secret",
      signOptions: {
        expiresIn: process.env.JWT_ACESS_TOKEN_EXPIRATION || "20m",
      },
    }),
    LiveModule,
  ],
  controllers: [RadioController],
  providers: [RadioService],
})
export class RadioModule {}

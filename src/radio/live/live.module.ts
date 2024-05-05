import { Module } from '@nestjs/common';
import { LiveController } from './live.controller';
import { LiveService } from './live.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '@/schemas/user.schema';
import { RadioSchema } from '@/schemas/radio.schema';
import { JwtModule } from '@nestjs/jwt';
import { RadioLiveSchema } from '@/schemas/radioLive.schema';

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
      {
        name: 'RadioLive',
        schema: RadioLiveSchema,
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "secret",
      signOptions: {
        expiresIn: process.env.JWT_ACESS_TOKEN_EXPIRATION || "20m",
      },
    }),
  ],
  controllers: [LiveController],
  providers: [LiveService]
})
export class LiveModule {}

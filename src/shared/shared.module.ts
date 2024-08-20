import { Module } from "@nestjs/common";
import { MinioModule } from "./minio/minio.module";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "@/schemas/user.schema";
import { JwtModule } from "@nestjs/jwt";

const mongooseModule = MongooseModule.forFeature([
  {
    name: "User",
    schema: UserSchema,
  },
]);

const jwtModule = JwtModule.register({
  secret: process.env.JWT_SECRET || "secret",
  signOptions: {
    expiresIn: process.env.JWT_ACESS_TOKEN_EXPIRATION || "20m",
  },
});

@Module({
  imports: [MinioModule, mongooseModule, jwtModule],
  exports: [MinioModule, mongooseModule, jwtModule],
})
export class SharedModule {}

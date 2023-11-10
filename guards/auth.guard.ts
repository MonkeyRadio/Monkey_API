import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { InjectRedis } from "@songkeys/nestjs-redis";
import { Redis } from "ioredis";
import { Model } from "mongoose";
import { User } from "@/schemas/user.schema";
import { CheckAuthentication } from "@/services/FamilyBasedAuth";
import { AccessToken } from "@/types/AccessToken";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectRedis() private readonly redis: Redis,
    protected readonly JwtService: JwtService,
  ) {}

  ignoreJwtExpiration = false;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(" ")[1];
    if (!token) throw new UnauthorizedException("No Authorization Header");

    let payload: AccessToken;

    try {
      payload = this.JwtService.verify(token, {
        ignoreExpiration: this.ignoreJwtExpiration,
      });
      if (
        !payload ||
        payload.userId === undefined ||
        payload.familyId === undefined ||
        payload.childId === undefined
      )
        throw new UnauthorizedException("Invalid Token");
    } catch (error) {
      if (error.name === "TokenExpiredError")
        throw new UnauthorizedException("Token Expired", "TokenExpiredError");
      throw new UnauthorizedException("Invalid Token");
    }

    if (
      !(await CheckAuthentication(
        this.redis,
        payload.familyId,
        payload.childId,
      ))
    )
      throw new UnauthorizedException("Invalid Token");

    const user = await this.userModel.findById(payload.userId).exec();
    if (!user) throw new UnauthorizedException("Invalid Token");

    request.user = {
      ...user.toObject(),
      familyId: payload.familyId,
      childId: payload.childId,
    };
    return true;
  }
}

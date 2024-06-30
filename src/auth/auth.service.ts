import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import {
  LoginDto,
  RegisterDto,
  RenewTokenDto,
  SignInDto,
  UserDto,
} from "./dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "@/schemas/user.schema";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { InjectRedis } from "@songkeys/nestjs-redis";
import Redis from "ioredis";
import {
  DestroyFamily,
  GenerateNewFamily,
  IncrementFamily,
} from "@/services/FamilyBasedAuth";
import { RequestAuthenticated } from "@/types/RequestAuthenticated";
import { UserScope } from "@/enums/UserScope.enum";
import { Role } from "@/enums/Role.enum";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectRedis() private readonly redis: Redis,
    private readonly jwtService: JwtService,
  ) {}

  async register(RegisterDto: RegisterDto): Promise<SignInDto> {
    if (process.env.BLOCK_REGISTRATION === "true")
      throw new BadRequestException("Registration is blocked");
    try {
      const user = await this.userModel.create(RegisterDto);
      return new SignInDto({
        ...user.toObject(),
        token: await this.signIn(user._id.toString()),
      });
    } catch (error) {
      if (error.code === 11000)
        throw new ConflictException("User already exists");
      throw error;
    }
  }

  async login(LoginDto: LoginDto): Promise<SignInDto> {
    const user = await this.userModel.findOne({ nickname: LoginDto.nickname });
    if (!user || !(await bcrypt.compare(LoginDto.password, user.password)))
      throw new UnauthorizedException("Invalid credentials");
    return new SignInDto({
      ...user.toObject(),
      token: await this.signIn(user._id.toString()),
    });
  }

  async renewToken(request: RequestAuthenticated): Promise<RenewTokenDto> {
    const familyIncremented = await IncrementFamily(
      this.redis,
      request.user.familyId,
      request.user.childId,
    );
    return new RenewTokenDto({
      token: await this.newToken(
        request.user._id.toString(),
        request.user.familyId,
        familyIncremented,
      ),
    });
  }

  async logout(request: RequestAuthenticated): Promise<void> {
    await DestroyFamily(this.redis, request.user.familyId);
  }

  newToken(userId: string, family: string, childId: number): Promise<string> {
    return this.jwtService.signAsync({
      userId,
      familyId: family,
      childId,
    });
  }

  async signIn(userId: string): Promise<string> {
    const familyName = await GenerateNewFamily(this.redis, userId);

    return this.newToken(userId, familyName, 0);
  }

  async me(request: RequestAuthenticated): Promise<UserDto> {
    return new UserDto(request.user);
  }

  async accredit(
    request: RequestAuthenticated,
    scope: UserScope,
    role: Role,
  ): Promise<boolean> {
    return (
      request.user.roles.includes(role) &&
      (request.user.scopes.includes(scope) ||
        request.user.scopes.includes(UserScope.ALL))
    );
  }
}

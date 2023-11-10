import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthGuard } from "@/guards/auth.guard";
import { AuthExpiredGuard } from "@/guards/authExpired.guard";
import { AuthUnsafeGuard } from "@/guards/AuthUnsafe.guard";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { RenewTokenDto, SignInDto, UserDto } from "./dto";
import { RequestAuthenticated } from "@/types/RequestAuthenticated";

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({ description: "User registered", type: SignInDto })
  @ApiBadRequestResponse({ description: "Bad request" })
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() RegisterDto: RegisterDto) {
    return this.authService.register(RegisterDto);
  }

  @ApiOkResponse({ description: "User registered", type: SignInDto })
  @ApiBadRequestResponse({ description: "Bad request" })
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() LoginDto: LoginDto) {
    return this.authService.login(LoginDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: "Token renewed", type: RenewTokenDto })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @UseGuards(AuthExpiredGuard)
  @Post("renewToken")
  @HttpCode(HttpStatus.OK)
  async renewToken(@Request() req: RequestAuthenticated) {
    return this.authService.renewToken(req);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: "User logged out" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @UseGuards(AuthUnsafeGuard)
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: RequestAuthenticated) {
    return this.authService.logout(req);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: "User data", type: UserDto })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @UseGuards(AuthGuard)
  @Get("me")
  @HttpCode(HttpStatus.OK)
  async me(@Request() req: RequestAuthenticated) {
    return this.authService.me(req);
  }
}

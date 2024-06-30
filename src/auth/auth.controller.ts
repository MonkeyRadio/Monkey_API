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
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "@/src/auth/dto";
import { LoginDto } from "@/src/auth/dto";
import { AuthGuard } from "@/guards/auth.guard";
import { AuthExpiredGuard } from "@/guards/authExpired.guard";
import { AuthUnsafeGuard } from "@/guards/AuthUnsafe.guard";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse, ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { RenewTokenDto, SignInDto, UserDto } from "./dto";
import { RequestAuthenticated } from "@/types/RequestAuthenticated";
import { UserScope } from "@/enums/UserScope.enum";
import { Role } from "@/enums/Role.enum";

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

  @ApiBearerAuth()
  @ApiOkResponse({ description: "User has accreditation" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiParam({ name: "scope", enum: UserScope })
  @ApiParam({ name: "role", enum: Role })
  @UseGuards(AuthGuard)
  @Post("accreditation")
  @HttpCode(HttpStatus.OK)
  async accreditations(
    @Request() req: RequestAuthenticated,
    @Body("scope") scope: UserScope,
    @Body("role") role: Role,
  ) {
    if (!role) throw new BadRequestException("Invalid role");
    if (!scope) throw new BadRequestException("Invalid scope");
    if (await this.authService.accredit(req, scope, role)) return;
    throw new UnauthorizedException("Unauthorized");
  }
}

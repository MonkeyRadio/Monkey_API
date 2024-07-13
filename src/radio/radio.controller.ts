import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  HttpCode,
  Put,
  Request,
  NotFoundException,
} from "@nestjs/common";
import { RadioService } from "./radio.service";
import { CreateRadioDto } from "./dto/create-radio.dto";
import { UpdateRadioDto } from "./dto/update-radio.dto";
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { MustBe } from "@/decorators/roles.decorator";
import { AuthGuard } from "@/guards/auth.guard";
import { RoleGuard } from "@/guards/role.guard";
import { RadioDto } from "./dto/radio.dto";
import { Request as ExpressRequest } from "express";
import { Role } from "@/enums/Role.enum";
import { UserRequest } from "@/decorators/user-request.decorator";
import { UserAuthenticated } from "@/types/UserRequest";

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags("radio")
@Controller("radio")
export class RadioController {
  constructor(private readonly radioService: RadioService) {}

  @ApiCreatedResponse({
    description: "The record has been successfully created.",
    type: RadioDto,
  })
  @MustBe(Role.Administrator)
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(201)
  @Post()
  create(@Body() createRadioDto: CreateRadioDto) {
    return this.radioService.create(createRadioDto);
  }

  @ApiOkResponse({
    description: "Get all radios that user has access to.",
    type: RadioDto,
    isArray: true,
  })
  @UseGuards(AuthGuard)
  @Get()
  findAll(@UserRequest() user: UserAuthenticated) {
    return this.radioService.findAll(user.scopes);
  }

  @ApiOkResponse({
    description: "The record has been successfully retrieved.",
    type: RadioDto,
  })
  @Get("findByDomain")
  findOneByDomain(@Request() query: ExpressRequest) {
    return this.radioService.findOneByDomain(query);
  }

  @ApiOkResponse({
    description: "The record has been successfully retrieved.",
    type: RadioDto,
  })
  @UseGuards(AuthGuard)
  @Get(":id")
  findOne(@UserRequest() user: UserAuthenticated, @Param("id") id: string) {
    if (!user.scopes?.includes(id) && !user.scopes?.includes("*"))
      throw new NotFoundException("Radio not found");
    return this.radioService.findOne(id);
  }

  @ApiAcceptedResponse({
    description: "The record has been successfully updated.",
    type: RadioDto,
  })
  @MustBe(Role.Administrator)
  @UseGuards(AuthGuard, RoleGuard)
  @Put(":id")
  @HttpCode(202)
  update(@Param("id") id: string, @Body() updateRadioDto: UpdateRadioDto) {
    return this.radioService.update(id, updateRadioDto);
  }

  @ApiAcceptedResponse({
    description: "The record has been successfully deleted.",
    type: RadioDto,
  })
  @MustBe(Role.Administrator)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(":id")
  @HttpCode(202)
  remove(@Param("id") id: string) {
    return this.radioService.remove(id);
  }
}

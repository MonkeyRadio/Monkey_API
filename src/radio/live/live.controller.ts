import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { LiveService } from "./live.service";
import { MustBe } from "@/decorators/roles.decorator";
import { Roles } from "@/constants/roles";
import { AuthGuard } from "@/guards/auth.guard";
import { RoleGuard } from "@/guards/role.guard";
import { CreateRadioLiveDto } from "./dto/createRadioLive.dto";
import { RadioLiveDto } from "./dto/radioLive.dto";

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags("radioLive")
@Controller("live")
export class LiveController {
  constructor(private readonly liveService: LiveService) {}

  @ApiCreatedResponse({
    description: "The record has been successfully created.",
    type: RadioLiveDto,
  })
  @MustBe(Roles.Administrator)
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(201)
  @Post()
  create(@Body() createRadioLiveDTO: CreateRadioLiveDto) {
    return this.radioService.create(createRadioDto);
  }
}

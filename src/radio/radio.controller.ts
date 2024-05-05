import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  HttpCode,
  Put,
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
import { Roles } from "@/constants/roles";
import { AuthGuard } from "@/guards/auth.guard";
import { RoleGuard } from "@/guards/role.guard";
import { RadioDto } from "./dto/radio.dto";

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags("radio")
@Controller("radio")
export class RadioController {
  constructor(private readonly radioService: RadioService) {}

  @ApiCreatedResponse({
    description: "The record has been successfully created.",
    type: RadioDto,
  })
  @MustBe(Roles.Administrator)
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(201)
  @Post()
  create(@Body() createRadioDto: CreateRadioDto) {
    return this.radioService.create(createRadioDto);
  }

  @ApiOkResponse({
    description: "All records have been successfully retrieved.",
    type: RadioDto,
    isArray: true,
  })
  @Get()
  findAll() {
    return this.radioService.findAll();
  }

  @ApiOkResponse({
    description: "The record has been successfully retrieved.",
    type: RadioDto,
  })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.radioService.findOne(id);
  }

  @ApiAcceptedResponse({
    description: "The record has been successfully updated.",
    type: RadioDto,
  })
  @MustBe(Roles.Administrator)
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
  @MustBe(Roles.Administrator)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(":id")
  @HttpCode(202)
  remove(@Param("id") id: string) {
    return this.radioService.remove(id);
  }
}

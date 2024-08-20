import {
  Controller,
  HttpStatus,
  NotFoundException,
  Param,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { CoverService } from "./cover.service";
import { MustBe } from "@/decorators/roles.decorator";
import { Role } from "@/enums/Role.enum";
import { AuthGuard } from "@/guards/auth.guard";
import { RoleGuard } from "@/guards/role.guard";
import { UserRequest } from "@/decorators/user-request.decorator";
import { UserAuthenticated } from "@/types/UserRequest";
import { RequiredPipe } from "../shared/pipes/required.pipe";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("cover")
export class CoverController {
  constructor(private readonly coverService: CoverService) {}

  @MustBe(Role.Streamer)
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor("file"))
  @Post(":radioId/:id")
  public async uploadCover(
    @UserRequest() user: UserAuthenticated,
    @Param("radioId", RequiredPipe) radioId: string,
    @Param("id", RequiredPipe) id: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /image\/(jpeg|png)/,
        })
        .addMaxSizeValidator({
          maxSize: 10 * 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    if (!user.scopes?.includes(radioId) && !user.scopes?.includes("*"))
      throw new NotFoundException("Radio not found");
    return this.coverService.uploadCover(radioId, id, file);
  }
}

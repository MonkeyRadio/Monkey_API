import { Module } from "@nestjs/common";
import { CoverService } from "./cover.service";
import { CoverController } from "./cover.controller";
import { SharedModule } from "../shared/shared.module";

@Module({
  imports: [SharedModule],
  controllers: [CoverController],
  providers: [CoverService],
  exports: [CoverService],
})
export class CoverModule {}

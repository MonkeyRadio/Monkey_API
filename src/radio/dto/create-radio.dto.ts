import { DiffusionLink } from "@/types/DiffusionLink";
import { Dto } from "@/utils/DtoClass";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

@Expose()
export class CreateRadioDto extends Dto {
  @ApiProperty({ description: "Radio name" })
  @Expose()
  name: string;

  @ApiProperty({ description: "Radio website url" })
  @Expose()
  websiteUrl: string;

  @ApiProperty({ description: "Radio live stream" })
  @Expose()
  liveStream: DiffusionLink[];

  @ApiProperty({ description: "Radio live video url" })
  @Expose()
  videoLiveUrl: string;
}

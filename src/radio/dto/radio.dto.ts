import { Exclude, Expose, Transform } from "class-transformer";
import { Dto } from "@/utils/DtoClass";
import { ApiProperty } from "@nestjs/swagger";
import { DiffusionLink } from "@/types/DiffusionLink";

@Exclude()
export class RadioDto extends Dto {
  @ApiProperty({ description: "Radio id", name: "id" })
  @Expose({ name: "id" })
  @Transform(({ value }) => value.toString())
  _id: string;

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

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
  @Transform(({ value }) =>
    value.map((v: DiffusionLink) => {
      let extension = "m3u8";
      switch (v.containerType) {
        case "hls":
          extension = ".m3u8";
          break;
        case "llhls":
          extension = ".m3u8";
          break;
        case "dash":
          extension = ".mpd";
          break;
        default:
          extension = "";
          break;
      }
      return {
        ...v,
        diffusionLink: `${v.name}${extension}`,
      };
    }),
  )
  @Expose()
  liveStream: DiffusionLink[];

  @ApiProperty({ description: "Radio live video url" })
  @Expose()
  videoLiveUrl: string;

  @ApiProperty({ description: "Radio picture" })
  @Expose()
  picture: string;

  @ApiProperty({ description: "Radio headline" })
  @Expose()
  headline: string;
}

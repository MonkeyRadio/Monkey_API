import { Exclude, Expose, Transform } from "class-transformer";
import { Dto } from "@/utils/DtoClass";
import { ApiProperty } from "@nestjs/swagger";

@Exclude()
export class RadioDto extends Dto {
  @ApiProperty({ description: "Radio id", name: "id" })
  @Expose({ name: "id" })
  @Transform(({ value }) => value.toString())
  _id: string;

  @ApiProperty({ description: "Radio name" })
  @Expose()
  name: string;

  @ApiProperty({ description: "Radio live video url" })
  @Expose()
  videoLiveUrl: string;
}

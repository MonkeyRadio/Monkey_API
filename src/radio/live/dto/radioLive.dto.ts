import { Exclude, Expose, Transform } from "class-transformer";
import { Dto } from "@/utils/DtoClass";
import { ApiProperty } from "@nestjs/swagger";

@Exclude()
export class RadioLiveDto extends Dto {
  @ApiProperty({ description: "Radio live id", name: "id" })
  @Expose({ name: "id" })
  @Transform(({ value }) => value.toString())
  _id: string;

  @ApiProperty({ description: "Radio live name" })
  @Expose()
  name: string;
}

import { Dto } from "@/utils/DtoClass";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

@Expose()
export class CreateRadioLiveDto extends Dto {
  @ApiProperty({ description: "Radio Live name" })
  @Expose()
  name: string;

  @ApiProperty({ description: "Radio Live local manifest url" })
  @Expose()
  manifestUrl: string;

  @ApiProperty({ description: "Radio Live authorized format" })
  @Expose()
  authorizedFormat: [string];
}

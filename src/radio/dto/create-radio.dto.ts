import { Dto } from "@/utils/DtoClass";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

@Expose()
export class CreateRadioDto extends Dto {
  @ApiProperty({ description: "Radio name" })
  @Expose()
  name: string;
}

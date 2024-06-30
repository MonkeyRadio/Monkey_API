import { IsNotEmpty, IsString } from "class-validator";
import { Dto } from "@/utils/DtoClass";
import { ApiProperty } from "@nestjs/swagger";

export class AccreditDto extends Dto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Role" })
  role: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Scope" })
  scope: string;
}

import { IsNotEmpty, IsString } from "class-validator";
import { Dto } from "@/utils/DtoClass";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto extends Dto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "User nickname" })
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "User password" })
  password: string;
}

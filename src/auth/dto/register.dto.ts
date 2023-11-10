import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Dto } from "@/utils/DtoClass";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto extends Dto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ description: "User nickname" })
  nickname: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: "User email" })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @ApiProperty({ description: "User password" })
  password: string;
}

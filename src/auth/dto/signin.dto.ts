import { Exclude, Expose } from "class-transformer";
import { UserDto } from "./user.dto";
import { ApiProperty } from "@nestjs/swagger";

@Exclude()
export class SignInDto extends UserDto {
  @ApiProperty({ description: "User token" })
  @Expose()
  token: string;
}

import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { Dto } from "@/utils/DtoClass";
import { ApiProperty } from "@nestjs/swagger";

@Exclude()
export class RenewTokenDto extends Dto {
  @ApiProperty({ description: "User token" })
  @Expose()
  @IsString()
  @IsNotEmpty()
  token: string;
}

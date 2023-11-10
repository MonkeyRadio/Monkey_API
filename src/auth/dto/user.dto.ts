import { Exclude, Expose, Transform } from "class-transformer";
import { Dto } from "@/utils/DtoClass";
import { ApiProperty } from "@nestjs/swagger";

@Exclude()
export class UserDto extends Dto {
  @ApiProperty({ description: "User id", name: "id" })
  @Expose({ name: "id" })
  @Transform(({ value }) => value.toString())
  _id: string;

  @ApiProperty({ description: "User nickname" })
  @Expose()
  nickname: string;

  @ApiProperty({ description: "User email" })
  @Expose()
  email: string;

  @ApiProperty({ description: "User roles" })
  @Expose()
  roles: string[];
}

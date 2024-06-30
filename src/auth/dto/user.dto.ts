import { Exclude, Expose, Transform } from "class-transformer";
import { Dto } from "@/utils/DtoClass";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@/enums/Role.enum";
import { UserScope } from "@/enums/UserScope.enum";

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
  roles: Role[];

  @ApiProperty({ description: "User scopes" })
  @Expose()
  scopes: UserScope[];
}

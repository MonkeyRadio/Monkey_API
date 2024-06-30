import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import * as bcrypt from "bcryptjs";
import { Role } from "@/enums/Role.enum";
import { UserScope } from "@/enums/UserScope.enum";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, type: String })
  nickname: string;

  @Prop({ unique: true, type: String })
  email: string;

  @Prop({ type: String })
  password: string;

  @Prop({ default: [Role.Member], type: Array })
  roles: Role[];

  @Prop({ default: [UserScope.Default], type: Array })
  scopes: UserScope[];
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export { UserSchema };

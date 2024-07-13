import { UserDocument } from "@/schemas/user.schema";

export type UserAuthenticated = UserDocument & {
  familyId: string;
  childId: number;
};

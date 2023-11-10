import { UserDocument } from "@/schemas/user.schema";
import { Request } from "express";

export type RequestAuthenticated = Request & {
  user: UserDocument & { familyId: string; childId: number };
};

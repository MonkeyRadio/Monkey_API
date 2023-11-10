import { Injectable } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";

@Injectable()
export class AuthExpiredGuard extends AuthGuard {
  ignoreJwtExpiration = true;
}

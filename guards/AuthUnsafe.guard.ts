import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";
import { AccessToken } from "@/types/AccessToken";

export class AuthUnsafeGuard extends AuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(" ")[1];
    if (!token) throw new UnauthorizedException("No Authorization Header");

    let payload: AccessToken;
    try {
      payload = this.JwtService.verify(token, { ignoreExpiration: true });
      if (
        !payload ||
        payload.userId === undefined ||
        payload.familyId === undefined ||
        payload.childId === undefined
      )
        throw new UnauthorizedException("Invalid Token");
    } catch (error) {
      throw new UnauthorizedException("Invalid Token");
    }
    request.user = {
      userId: payload.userId,
      familyId: payload.familyId,
      childId: payload.childId,
    };
    return true;
  }
}

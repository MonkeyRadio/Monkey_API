import { SetMetadata } from "@nestjs/common";

export const MustBe = (...args: string[]) => SetMetadata("roles", args);

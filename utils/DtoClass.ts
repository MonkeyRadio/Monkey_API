import { Exclude } from "class-transformer";

@Exclude()
export class Dto {
  constructor(partial: Partial<unknown>) {
    Object.assign(this, partial);
  }
}

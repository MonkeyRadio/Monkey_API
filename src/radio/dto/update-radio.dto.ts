import { PartialType } from "@nestjs/swagger";
import { CreateRadioDto } from "./create-radio.dto";

export class UpdateRadioDto extends PartialType(CreateRadioDto) {}

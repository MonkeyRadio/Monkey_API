import { DiffusionLink } from "@/types/DiffusionLink";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type RadioDocument = HydratedDocument<Radio>;

@Schema({ timestamps: true })
export class Radio {
  @Prop({ unique: true, type: String })
  name: string;

  @Prop({ type: String, required: false, unique: true, index: true })
  websiteUrl: string;

  @Prop({ type: Array, required: false, default: [] })
  liveStream: DiffusionLink[];

  @Prop({ type: String })
  videoLiveUrl: string;
}

export const RadioSchema = SchemaFactory.createForClass(Radio);

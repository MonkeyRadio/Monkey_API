import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type RadioDocument = HydratedDocument<Radio>;

@Schema({ timestamps: true })
export class Radio {
  @Prop({ unique: true, type: String })
  name: string;

  @Prop({ type: String })
  videoLiveUrl: string;
}

export const RadioSchema = SchemaFactory.createForClass(Radio);

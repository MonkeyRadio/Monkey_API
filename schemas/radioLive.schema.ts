import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type RadioLiveDocument = HydratedDocument<RadioLive>;

@Schema({ timestamps: true })
export class RadioLive {
  @Prop({ type: String })
  name: string;
  
  @Prop({ type: String })
  manifestUrl: string;

  @Prop({ type: String })
  authorizedFormat: [string];

  @Prop({ type: Number })
  segmentDuration: number;
}

export const RadioLiveSchema = SchemaFactory.createForClass(RadioLive);

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, ObjectId, SchemaType, SchemaTypes } from "mongoose";

export type RadioDocument = HydratedDocument<Radio>;

@Schema({ timestamps: true })
export class Radio {
  @Prop({ unique: true, type: String })
  name: string;

  @Prop({ type: Array, ref: "RadioLive", default: []})
  lives: ObjectId[];
}

export const RadioSchema = SchemaFactory.createForClass(Radio);

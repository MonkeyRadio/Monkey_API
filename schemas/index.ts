import mongoose from "mongoose";
import { Radio, RadioSchema } from "./radio.schema";

const getModels = async () => {
  mongoose.set("strictQuery", false);

  await mongoose.connect(
    `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`,
    {
      dbName: process.env.MONGO_DB as string,
    },
  );

  const RadioModel = mongoose.model<Radio>(Radio.name, RadioSchema);

  return {
    RadioModel,
  };
};

export default getModels;

import { Radio } from "@/schemas/radio.schema";
import { RadioLive } from "@/schemas/radioLive.schema";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateRadioLiveDto } from "./dto/createRadioLive.dto";

@Injectable()
export class LiveService {
  constructor(
    @InjectModel(Radio.name) private radioModel: Model<Radio>,
    @InjectModel(RadioLive.name) private radioLiveModel: Model<RadioLive>
  ) {}

  async create(radioId: string, createRadioLiveDto: CreateRadioLiveDto) {
    try {
      const radio = await this.radioModel.findById(radioId);
      if (!radio) {
        throw new NotFoundException("Radio not found");
      }
      const createdRadioLive = new this.radioLiveModel(createRadioLiveDto);
      await createdRadioLive.save();
      radio.lives.push(createdRadioLive.id);
      await radio.save();
    } catch (error) {
      throw error;
    }
  }

  async findAll(radioId: string) {
    try {
      const radio = await this.radioModel.findById(radioId).populate("lives");
      if (!radio) {
        throw new NotFoundException("Radio not found");
      }
      return radio.lives;
    } catch (error) {
      throw error;
    }
  }

  async findOne(radioId: string, liveId: string) {
    try {
      const radio = await this.radioModel.findById(radioId).populate("lives");
      if (!radio) {
        throw new NotFoundException("Radio not found");
      }
      const live = radio.lives.find((live) => live === liveId);
      if (!live) {
        throw new NotFoundException("Live not found");
      }
      return live;
    } catch (error) {
      throw error;
    }
  }
}

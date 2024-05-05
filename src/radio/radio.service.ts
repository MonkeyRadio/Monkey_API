import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateRadioDto } from "./dto/create-radio.dto";
import { UpdateRadioDto } from "./dto/update-radio.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Radio } from "@/schemas/radio.schema";
import { Model } from "mongoose";
import { RadioDto } from "./dto/radio.dto";
import { Request } from "express";

@Injectable()
export class RadioService {
  constructor(@InjectModel(Radio.name) private radioModel: Model<Radio>) {}

  async create(createRadioDto: CreateRadioDto) {
    try {
      const radio = await this.radioModel.create(createRadioDto);
      return new RadioDto(radio.toObject());
    } catch (error) {
      if (error.code === 11000)
        throw new BadRequestException("Radio already exists");
      throw error;
    }
  }

  async findAll() {
    const radios = await this.radioModel.find();

    return radios.map((radio) => new RadioDto(radio.toObject()));
  }

  async findOne(id: string) {
    try {
      const radio = await this.radioModel.findById(id);
      return new RadioDto(radio.toObject());
    } catch (error) {
      throw new NotFoundException("Radio not found");
    }
  }

  async findOneByDomain(query: Request) {
    if (!query.query.websiteDomain)
      throw new BadRequestException("Field websiteDomain is required");
    try {
      const radio = await this.radioModel.findOne({
        websiteUrl: query.query.websiteDomain,
      });
      return new RadioDto(radio.toObject());
    } catch (error) {
      throw new NotFoundException("Radio not found");
    }
  }

  async update(id: string, updateRadioDto: UpdateRadioDto) {
    try {
      const radio = await this.radioModel.findByIdAndUpdate(id, updateRadioDto);
      return new RadioDto(
        (await this.radioModel.findById(radio.id)).toObject(),
      );
    } catch (error) {
      throw new BadRequestException("Radio not found");
    }
  }

  async remove(id: string) {
    try {
      return new RadioDto(
        (await this.radioModel.findByIdAndDelete(id)).toObject(),
      );
    } catch (error) {
      throw new BadRequestException("Radio not found");
    }
  }
}

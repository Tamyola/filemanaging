import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File } from './file.schema';

@Injectable()
export class FilesService {
  constructor(@InjectModel(File.name) private readonly fileModel: Model<File>) {}

  async createFile(fileData: Partial<File>): Promise<File> {
    const file = new this.fileModel(fileData);
    return file.save();
  }

  async findFileById(id: string): Promise<File | null> {
    return this.fileModel.findById(id).exec();
  }

  async findAllFiles(): Promise<File[]> {
    return this.fileModel.find().exec();
  }
}
import { Schema, Document } from 'mongoose';

export const FileSchema = new Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true },
  mimetype: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export interface File extends Document {
  filename: string;
  path: string;
  size: number;
  mimetype: string;
  createdAt: Date;
}
import type { MongoRecord } from "./mongo-record.ts";
import mongoose, { Schema } from "mongoose";

export interface ITag extends MongoRecord {
  name: string;
  color: string;
}

const tagSchema: Schema = new Schema({
  name: { type: String, lowercase: true, required: true },
  color: { type: String, required: true },
});

const Tag = mongoose.model<ITag>("Tag", tagSchema);

export default Tag;

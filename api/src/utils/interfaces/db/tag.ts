import mongoose, { Schema, Document } from "mongoose";

export interface ITag extends Document {
  name: string;
  color: string;
}

const tagSchema: Schema = new Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
});

const Tag = mongoose.model<ITag>("Tag", tagSchema);

export default Tag;

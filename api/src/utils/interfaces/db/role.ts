import mongoose, { Schema, Document } from "mongoose";

export interface IRole extends Document {
  role: string;
  label: string;
  rank: number;
}

const roleSchema: Schema = new Schema(
  {
    role: { type: String, required: true },
    label: { type: String, required: true },
    rank: { type: Number, required: true },
  },
  { timestamps: true }
);

const Role = mongoose.model<IRole>("Role", roleSchema);

export default Role;

import mongoose, { Schema, Document } from "mongoose";

export interface IRole extends Document {
  role: string;
  label: string;
  rank: number;
  isActive: boolean;
}

const roleSchema: Schema = new Schema(
  {
    role: { type: String, required: true },
    label: { type: String, required: true },
    rank: { type: Number, required: true },
    isActive: { type: Boolean, required: false, default: false },
  },
  { timestamps: true }
);

const Role = mongoose.model<IRole>("Role", roleSchema);

export default Role;

import mongoose, { Schema, Document } from "mongoose";
import { IPermission } from "./permission";

export interface IRole extends Document {
  role: string;
  label: string;
  rank: number;
  permissions: IPermission["_id"][];
}

const roleSchema: Schema = new Schema(
  {
    role: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    rank: { type: Number, required: true },
    permissions: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Permission" }],
  },
  { timestamps: true },
);

const Role = mongoose.model<IRole>("Role", roleSchema);

export default Role;

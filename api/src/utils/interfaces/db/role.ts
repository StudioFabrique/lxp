import mongoose, { Schema, Document } from "mongoose";
import { IPermission } from "./permission";

export interface IRole extends Document {
  role: string;
  label: string;
  rank: number;
  isProtected: boolean; // Le role ne pourra pas être modifié ainsi que ses permissions à l'exception du label
  permissions: IPermission["_id"][];
}

const roleSchema: Schema = new Schema(
  {
    role: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    rank: { type: Number, required: true },
    isProtected: { type: Boolean, required: true, default: false },
    permissions: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Permission" }],
  },
  { timestamps: true },
);

const Role = mongoose.model<IRole>("Role", roleSchema);

export default Role;

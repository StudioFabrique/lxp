import mongoose, { Schema, Document } from "mongoose";
import { type IPermission } from "./permission.ts";

export interface IRole extends Document {
  role: string;
  label: string;
  rank: number;
  protection: number; // Les attributs du role ne pourront pas être modifiés selon le degré de protection, utilisé pour les roles systèmes
  permissions: IPermission["_id"][];
}

const roleSchema: Schema = new Schema(
  {
    role: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    rank: { type: Number, required: true },
    protection: { type: Number, required: true, default: 0 },
    permissions: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Permission" }],
  },
  { timestamps: true },
);

const Role = mongoose.model<IRole>("Role", roleSchema);

export default Role;

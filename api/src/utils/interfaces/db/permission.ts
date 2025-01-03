import mongoose, { Schema, Document } from "mongoose";
import { IRole } from "./role";

export interface IPermission extends Document {
  name: string; // <action>:<ressource> OR <layout>:<name> OR <component>:<name>
  isRole: boolean;
  roles: IRole["_id"][];
}

const permissionSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    isRole: { type: Boolean, required: true, default: false },
    roles: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Role" }],
  },
  { timestamps: false },
);

const Permission = mongoose.model<IPermission>("Permission", permissionSchema);

export default Permission;

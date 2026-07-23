import mongoose, { Schema, Document } from "mongoose";

export interface IPermission extends Document {
  name: string; // <action>:<ressource> OR <layout>:<name> OR <component>:<name>
  isRole: boolean;
}

const permissionSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    isRole: { type: Boolean, required: true, default: false },
  },
  { timestamps: false },
);

const Permission = mongoose.model<IPermission>("Permission", permissionSchema);

export default Permission;

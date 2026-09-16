import type { MongoRecord } from "./mongo-record.ts";
import mongoose, { Schema } from "mongoose";

export interface IPermission extends MongoRecord {
  name: string; // <action>:<ressource>
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

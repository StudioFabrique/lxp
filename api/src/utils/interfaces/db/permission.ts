import mongoose, { Schema, Document } from "mongoose";

export interface IPermission {
  role: string;
  action: string;
  subject: Array<string>;
}

const permissionSchema: Schema = new Schema(
  {
    role: { type: String, required: true },
    action: { type: String, required: true },
    subject: { type: [String], required: true },
  },
  { timestamps: true }
);

const Permission = mongoose.model<IPermission>("Permission", permissionSchema);

export default Permission;

import mongoose, { Schema, Document } from "mongoose";

export interface IPermission {
  role: string;
  action: string;
  ressources: Array<string>;
}

const permissionSchema: Schema = new Schema(
  {
    role: { type: String, required: true },
    action: { type: String, required: true },
    ressources: { type: [String], required: true },
  },
  { timestamps: true }
);

const Permission = mongoose.model<IPermission>("Permission", permissionSchema);

export default Permission;

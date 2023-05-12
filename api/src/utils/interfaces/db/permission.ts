import mongoose, { Schema } from "mongoose";

export interface IPermission {
  role: string;
  resource: string;
  action: string;
  attributes: Array<string>;
}

const permissionSchema: Schema = new Schema({
  role: { type: String, required: true },
  resource: { type: String, required: true },
  action: { type: String, required: true },
  attributes: { type: Array, required: false },
});

const Permission = mongoose.model<IPermission>("Permission", permissionSchema);

export default Permission;

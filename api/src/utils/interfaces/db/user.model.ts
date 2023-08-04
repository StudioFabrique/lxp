import mongoose, { Schema, Document } from "mongoose";
import { IRole } from "./role";
import { IGroup } from "./group";

export interface IUser extends Document {
  email: string;
  firstname: string;
  lastname: string;
  password?: string;
  roles: IRole["_id"];
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  nickname?: string;
  address: string;
  postCode: string;
  city: string;
  phoneNumber: string;
  group?: IGroup["_id"];
}

const userSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String },
    roles: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Role",
      required: true,
    },
    avatar: { type: String, required: false },
    isActive: { type: Boolean, required: true },
    nickname: { type: String, required: false },
    address: { type: String, required: true },
    postCode: { type: String, required: true },
    city: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    group: { type: [mongoose.Schema.Types.ObjectId], ref: "Group" },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;

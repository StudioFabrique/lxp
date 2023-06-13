import mongoose, { Schema, Document } from "mongoose";
import { IRole } from "../role";
import { IGroup } from "../group";

export interface IStudent extends Document {
  email: string;
  password: string;
  roles: IRole["_id"];
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  nickname: string;
  address: string;
  postCode: string;
  city: string;
  phoneNumber: string;
  group?: IGroup["_id"];
}

const studentSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Role",
      required: true,
    },
    avatar: { type: String, required: false },
    isActive: { type: Boolean, required: true },
    nickname: { type: String, required: true },
    address: { type: String, required: true },
    postCode: { type: String, required: true },
    city: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    group: { type: [mongoose.Schema.Types.ObjectId], ref: "Group" },
  },
  { timestamps: true }
);

const Student = mongoose.model<IStudent>("Student", studentSchema);

export default Student;

import { Document, Schema, model } from "mongoose";
import { IStudent } from "./student/student.model";
import { IUser } from "./user/user.model";
import { IRole } from "./role";

export interface IGroup extends Document {
  name: string;
  desc: string;
  users?: IUser["_id"];
  students?: IStudent["_id"];
  roles: IRole["_id"];
  createdAt: Date;
  updatedAt: Date;
}

const groupSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    users: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    students: {
      type: [Schema.Types.ObjectId],
      ref: "Student",
    },
    roles: {
      type: [Schema.Types.ObjectId],
      ref: "Role",
      required: true,
    },
  },
  { timestamps: true }
);

const Group = model<IGroup>("Group", groupSchema);

export default Group;

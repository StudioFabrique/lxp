import { Document, Schema, model } from "mongoose";
import { IStudent } from "./student/student.model";
import { IUser } from "./teacher-admin/teacher.model";
import { IRole } from "./role";

export interface IGroup extends Document {
  name: string;
  desc: string;
  teachers?: IUser["_id"];
  users?: IStudent["_id"];
  role: IRole["_id"];
  createdAt: Date;
  updatedAt: Date;
}

const groupSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    teachers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      unique: true,
    },
    users: {
      type: [Schema.Types.ObjectId],
      ref: "Student",
    },
    role: {
      type: [Schema.Types.ObjectId],
      ref: "Role",
    },
  },
  { timestamps: true }
);

const Group = model<IGroup>("Group", groupSchema);

export default Group;
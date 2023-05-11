import { Schema, model } from "mongoose";
import { IStudent } from "./student/student.model";
import { IUser } from "./teacher-admin/teacher.model";

export interface IGroup {
  name: string;
  desc: string;
  teachers?: IUser[];
  users?: IStudent[];
  createdAt: Date;
  updatedAt: Date;
}

const groupShema: Schema = new Schema(
  {
    name: { type: String, required: true },
    teachers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    users: {
      type: [Schema.Types.ObjectId],
      ref: "Student",
    },
  },
  { timestamps: true }
);

const Group = model<IGroup>("Group", groupShema);

export default Group;

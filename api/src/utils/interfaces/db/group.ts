import { Document, Schema, model } from "mongoose";
import { IStudent } from "./student/student.model";
import { IUser } from "./teacher-admin/teacher.model";
import { IRole } from "./role";

export interface IGroup extends Document {
  name: string;
  desc: string;
  teachers?: IUser["_id"];
  users?: IStudent["_id"];
  roles: IRole["_id"];
  createdAt: Date;
  updatedAt: Date;
}

const groupSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    teachers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    users: {
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

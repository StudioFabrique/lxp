import mongoose, { Document, Schema, model } from "mongoose";
//import { IStudent } from "./student/student.model";
import { IRole } from "./role";
import { IUser } from "./user";
import { ITag } from "./tag";

export interface IGroup extends Document {
  name: string;
  desc: string;
  users?: IUser["_id"];
  tags?: ITag["_id"];
  roles: IRole["_id"];
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const groupSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    tags: { type: [Schema.Types.ObjectId], ref: "Role", required: false },
    roles: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Role",
      required: true,
    },
    image: { type: Schema.Types.String, required: true },
  },
  { timestamps: true }
);

const Group = mongoose.model<IGroup>("Group", groupSchema);

export default Group;

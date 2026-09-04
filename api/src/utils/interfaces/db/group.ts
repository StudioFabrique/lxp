import mongoose, { type Document, Schema, model } from "mongoose";
import { type IRole } from "./role.ts";
import { type IUser } from "./user.ts";
import { type ITag } from "./tag.ts";
import { type IPromptStats } from "./prompt-stats.ts";

export interface IGroup extends Document {
  name: string;
  desc?: string;
  users?: IUser["_id"];
  tags?: ITag["_id"];
  roles: IRole["_id"];
  createdBy?: IUser["_id"];
  image: Buffer;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  promptStats?: IPromptStats["_id"];
}

const groupSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    desc: { type: String, required: false },
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    tags: { type: [Schema.Types.ObjectId], ref: "Tag", required: false },
    roles: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Role",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    isActive: { type: Boolean, default: false },
    image: { type: Buffer, required: false },
    promptStats: {
      type: [Schema.Types.ObjectId],
      ref: "PromptStats",
      required: false,
    },
  },
  { timestamps: true },
);

const Group = mongoose.model<IGroup>("Group", groupSchema);

export default Group;

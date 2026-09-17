import type { MongoRecord, MongoRef } from "./mongo-record.ts";
import mongoose, { Schema } from "mongoose";
import { type IRole } from "./role.ts";
import { type IUser } from "./user.ts";
import { type ITag } from "./tag.ts";
import { type IPromptStats } from "./prompt-stats.ts";

export interface IGroup extends MongoRecord {
  name: string;
  desc?: string;
  users?: MongoRef<IUser>[];
  tags?: MongoRef<ITag>[];
  roles: MongoRef<IRole>[];
  createdBy?: MongoRef<IUser>;
  image: Buffer;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  promptStats?: MongoRef<IPromptStats>[];
}

const groupSchema: Schema = new Schema(
  {
    name: { type: String, lowercase: true, required: true },
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

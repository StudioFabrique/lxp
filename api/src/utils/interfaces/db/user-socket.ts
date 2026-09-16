import type { MongoRecord } from "./mongo-record.ts";
import mongoose, { Schema } from "mongoose";
import { type IUser } from "./user.ts";

export interface IUserSocket extends MongoRecord {
  userId: string;
  socketId: string;
  rank: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSocketSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    socketId: { type: String, required: true, unique: true },
    rank: { type: Number, required: true },
  },
  { timestamps: true },
);

const UserSocket = mongoose.model<IUserSocket>("UserSocket", userSocketSchema);

export default UserSocket;

import type { MongoRecord } from "./mongo-record.ts";
import mongoose, { Schema } from "mongoose";
import type { IUser } from "./user.ts";

export interface IGraduation extends MongoRecord {
  title: string;
  degree: string;
  date: Date;
  user: IUser["_id"];
}

const graduationSchema: Schema = new Schema({
  title: { type: String, lowercase: true, required: true },
  degree: { type: String, lowercase: true, required: true },
  date: { type: Date, required: true },
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

const Graduation = mongoose.model<IGraduation>("Graduation", graduationSchema);

export default Graduation;

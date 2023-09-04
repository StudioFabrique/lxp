import mongoose, { Document, Mongoose, Schema } from "mongoose";
import { IUser } from "./user";

export interface IGraduation extends Document {
  title: string;
  degree: string;
  date: Date;
  user?: IUser["_id"];
}

const graduationSchema: Schema = new Schema({
  title: { type: String, required: true },
  degree: { type: String, required: true },
  date: { type: Date, required: true },
  users: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

const Graduation = mongoose.model<IGraduation>("Graduation", graduationSchema);

export default Graduation;

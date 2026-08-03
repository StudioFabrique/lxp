import mongoose, { Document, Schema } from "mongoose";
import { type IUser } from "./user.ts";

export interface IHobby extends Document {
  title: string;
  user: IUser["_id"];
}

const hobbySchema = new Schema({
  title: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

const Hobby = mongoose.model<IHobby>("Hobby", hobbySchema);

export default Hobby;

import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user";

export interface IHobby extends Document {
  title: string;
  user?: IUser["_id"];
}

const hobbySchema = new Schema({
  title: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, required: true },
});

const Hobby = mongoose.model<IHobby>("Hobby", hobbySchema);

export default Hobby;

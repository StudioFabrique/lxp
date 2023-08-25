import { Document } from "mongoose";
import { IUser } from "./user.model";

export interface IGraduation extends Document {
  title: string;
  degree: string;
  date: Date;
  user?: IUser;
}

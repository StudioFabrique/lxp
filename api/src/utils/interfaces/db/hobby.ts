import { Document } from "mongoose";
import { IUser } from "./user.model";

export interface IHobby extends Document {
  title: string;
  user?: IUser;
}

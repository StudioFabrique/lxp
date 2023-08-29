import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user";

export type LinkType =
  | "website"
  | "twitter"
  | "facebook"
  | "youtube"
  | "instagram"
  | "linkedin";

export interface ILink extends Document {
  url: string;
  type: LinkType;
  alias?: string | null;
  user?: IUser["_id"];
}

const linkSchema = new Schema({
  url: { type: String, required: true },
  type: { type: String, required: true },
  alias: { type: String, required: false },
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

const Link = mongoose.model("Link", linkSchema);

export default Link;

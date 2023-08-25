import { Document } from "mongoose";
import { IUser } from "./user.model";

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
  user?: IUser;
}

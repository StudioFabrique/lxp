import User from "./user";

export type LinkType =
  | "website"
  | "twitter"
  | "facebook"
  | "youtube"
  | "instagram"
  | "linkedin";

export interface Link {
  _id?: string;
  url: string;
  type: LinkType;
  alias?: string | null;
  user?: User;
}

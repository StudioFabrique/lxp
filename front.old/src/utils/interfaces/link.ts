import User from "./user";

export type LinkType =
  | "website"
  | "twitter"
  | "facebook"
  | "youtube"
  | "instagram"
  | "linkedin";

export interface Link {
  url: string;
  type: LinkType;
  alias?: string | null;
  user?: User;
}

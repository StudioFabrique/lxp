export interface Activity {
  id: number;
  url: string;
  type: ActivityType;
  order: number;
  title?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  resourceActivities?: ActivityResource[];
  resourceBonusActivities?: ActivityResource[];
}

export type ActivityType =
  | "text"
  | "image"
  | "video"
  | "iframe"
  | "resource"
  | "file";

export interface ActivityResource {
  id: number;
  label: string;
  order: number;
  url: string;
}

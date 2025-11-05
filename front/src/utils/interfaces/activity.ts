export interface Activity {
  id: number;
  url: string;
  type: ActivityType;
  order: number;
  title?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  resourceActivities?: Resource[];
}

export type ActivityType = "text" | "image" | "video" | "iframe" | "resource";

export interface Resource {
  id: number;
  label: string;
  order: number;
  url: string;
}

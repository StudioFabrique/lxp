export interface Activity {
  id: number;
  url: string;
  type: "text" | "video" | "image" | "resource";
  order: number;
  title?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  resourceActivities?: Resource[];
}

export interface Resource {
  id: number;
  label: string;
  order: number;
  url: string;
}

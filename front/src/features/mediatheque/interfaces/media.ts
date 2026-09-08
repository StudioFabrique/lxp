export type MediaType = "image" | "video" | "audio" | "resource";

export type MediaAssociatedActivity = {
  id: number;
  title: string;
  type: string;
  order: number;
  parent: "lesson" | "resource";
  parentTitle: string;
  courseTitle?: string;
  moduleTitle?: string;
  moduleId?: number;
  lessonId?: number;
  resourceId?: number;
};

export default interface Media {
  id: number;
  url: string;
  name: string;
  type: MediaType;
  size: number;
  used: number;
  createdAt: string;
  associatedActivities: MediaAssociatedActivity[];
}

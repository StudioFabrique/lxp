import type { Activity } from "./activity";
import type Course from "./course";
import LessonRating from "../../features/module-preview/interfaces/lesson-rating";
import type LessonRead from "./lesson-read";
import type Tag from "./tag";

export default interface Lesson {
  id?: number;
  title: string;
  description: string;
  modalite: string;
  tag: Tag;
  createdAt?: string;
  updatedAt?: string;
  isSelected?: boolean;
  author?: string;
  adminId: number;
  course: Course;
  courseId?: number;
  activities?: Activity[];
  order?: number;
  lessonsRead?: LessonRead[];
  lessonRating: LessonRating[];
}

export interface LessonWithActivitiesCount {
  id: number;
  title: string;
  activitiesCount: number;
  isSelected?: boolean;
}

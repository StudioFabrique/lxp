import type Activity from "./activity";
import type Course from "./course";
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
  activities?: Activity[];
  order?: number;
  lessonsRead?: LessonRead[];
}

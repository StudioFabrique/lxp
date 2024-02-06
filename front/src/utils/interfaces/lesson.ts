import Activity from "./activity";
import Course from "./course";
import LessonRead from "./lesson-read";
import Tag from "./tag";

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

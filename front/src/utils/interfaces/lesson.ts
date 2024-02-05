import Activity from "./activity";
import Course from "./course";
import Tag from "./tag";
import User from "./user";

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
  lessonsRead?: {
    id: number;
    lesson: Lesson;
    user: User;
    beganAt: Date;
    finishedAt: Date;
  }[];
}

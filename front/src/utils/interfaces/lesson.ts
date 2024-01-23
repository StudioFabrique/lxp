import Activity from "./activity";
import Course from "./course";
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
  readBy?: string[];
}

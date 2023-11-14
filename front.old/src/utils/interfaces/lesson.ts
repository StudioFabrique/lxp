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
}

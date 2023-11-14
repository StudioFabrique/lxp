import Role from "./role";
import Student from "./student";
import Tag from "./tag";
import User from "./user";

export default interface Group {
  _id?: string;
  name: string;
  desc: string;
  users?: Array<User>;
  students?: Array<Student>;
  startDate: string;
  endDate: string;
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
  isSelected?: boolean;
  index?: number;
  tags: Array<Tag>;
  roles?: Array<Role>;
}

import Role from "./role";
import Student from "./student";
import User from "./user";

export default interface Group {
  _id: string;
  name: string;
  desc: string;
  users?: Array<User>;
  students?: Array<Student>;
  createdAt: Date;
  updatedAt: Date;
  isActive?: boolean;
  isSelected?: boolean;
  index?: number;
  roles?: Array<Role>;
}

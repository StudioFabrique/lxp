import Role from "./role";
import Student from "./student";
import User from "./user";

export default interface Group extends Document {
  _id: string;
  name: string;
  desc: string;
  users?: User["_id"];
  students?: Student["_id"];
  role: Role["_id"];
  createdAt: Date;
  updatedAt: Date;
  isActive?: boolean;
  isSelected?: boolean;
  index?: number;
  roles?: Array<Role>;
}

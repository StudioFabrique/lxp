import Role from "./role";
import Student from "./student";
import User from "./user";

export default interface Group extends Document {
  name: string;
  desc: string;
  users?: User["_id"];
  students?: Student["_id"];
  role: Role["_id"];
  createdAt: Date;
  updatedAt: Date;
}

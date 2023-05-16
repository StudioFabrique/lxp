import Role from "./role";
import Student from "./student";
import User from "./user";

export default interface IGroup extends Document {
  name: string;
  desc: string;
  teachers?: User["_id"];
  users?: Student["_id"];
  role: Role["_id"];
  createdAt: Date;
  updatedAt: Date;
}

import Skill from "./skill";
import User from "./user";

export default interface Module {
  _id?: string;
  title: string;
  description: string;
  teachers: Array<User>;
  skills: Array<Skill>;
  nbHours: number;
  image: string;
}

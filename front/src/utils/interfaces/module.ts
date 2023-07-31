import Skill from "./skill";
import User from "./user";

export default interface Module {
  _id?: string;
  title: string;
  description: string;
  teachers: Array<User> | Array<string>;
  skills: Array<Skill> | Array<number>;
  nbHours: number;
  imageUrl: string;
  imageTemp?: File;
}

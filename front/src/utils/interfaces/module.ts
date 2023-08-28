import Skill from "./skill";
import User from "./user";

export default interface Module {
  id?: number;
  title: string;
  description: string;
  contacts: Array<User>;
  skills: Array<Skill>;
  duration: number;
  imageUrl?: string;
  imageTemp?: File;
}

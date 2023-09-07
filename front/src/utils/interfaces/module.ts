import Skill from "./skill";
import User from "./user";

export default interface Module {
  id?: number;
  title: string;
  description: string;
  contacts: Array<User>;
  bonusSkills: Array<Skill>;
  duration: number;
  minDate?: string;
  maxDate?: string;
  image?: any;
  synchrone?: boolean;
}

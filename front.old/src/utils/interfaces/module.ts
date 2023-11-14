import Parcours from "./parcours";
import Skill from "./skill";
import User from "./user";

export default interface Module {
  id?: number;
  title: string;
  description: string;
  contacts: Array<User>;
  bonusSkills: Array<Skill>;
  duration: number;
  image?: string;
  thumb?: string;
  minDate?: string;
  maxDate?: string;
  parcours: Parcours;
}

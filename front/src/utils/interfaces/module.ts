import Contact from "./contact";
import Course from "./course";
import Parcours from "./parcours";
import Skill from "./skill";

export default interface Module {
  id?: number;
  title: string;
  description: string;
  contacts: Array<Contact>;
  bonusSkills: Array<Skill>;
  duration: number;
  image?: string;
  thumb?: string;
  minDate?: string;
  maxDate?: string;
  parcours: Parcours;
  courses: Array<Course>;
}

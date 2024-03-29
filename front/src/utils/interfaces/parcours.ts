import Contact from "./contact";
import Formation from "./formation";
import Group from "./group";
import Module from "./module";
import Objective from "./objective";
import Skill from "./skill";
import Tag from "./tag";

export default interface Parcours {
  id?: number;
  title: string;
  description?: string;
  image?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
  adminId?: number;
  formation: Formation;
  tags: Array<Tag>;
  contacts: Array<Contact>;
  skills: Array<Skill>;
  bonusSkills: Array<Skill>;
  virtualClass?: string;
  objectives: Array<Objective>;
  modules: Array<Module>;
  groups: Array<Group>;
  isPublished: boolean;
  author: string;
  visibility: boolean;
  thumb?: string;
}

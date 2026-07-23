import Contact from "../../../utils/interfaces/contact";
import Skill from "../../../utils/interfaces/skill";

// Type definition for module data structure
export type ModuleData = {
  id: number;
  title: string;
  quizInstructions?: string;
  thumb: string | null; // Optional base64 encoded thumbnail
  duration?: number; // Duration in minutes
  description: string;
  contacts: Contact[]; // Associated contacts/instructors
  skills: Skill[]; // Associated bonus skills
};

export type SourceModule = {
  id: number;
  title: string;
  description: string;
  quizInstructions?: string;
  thumb: string | null;
  contacts: Contact[];
  courses: { id: number; title: string }[];
  parcours: { id: number; title: string };
  bonusSkills: Skill[];
};

export type ParcoursModuleResources = {
  id: number;
  formationId: number;
  contacts: Contact[];
  bonusSkills: Skill[];
};

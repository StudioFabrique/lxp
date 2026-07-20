import Contact from "./contact";
import Skill from "./skill";

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

export type Metadatas = {
  id: number;
  bonusSkills: Skill[];
  contacts: Contact[];
  courses: { id: number; title: string }[];
  parcours: { id: number; title: string };
};

export type MetadataList = {
  id: number;
  title: string;
  description: string;
  quizInstructions?: string;
  thumb: string | null;
  metadatas: Metadatas[];
  moduleId: number | null;
};

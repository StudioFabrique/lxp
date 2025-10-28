import Contact from "./contact";
import Skill from "./skill";

// Type definition for module data structure
export type ModuleData = {
  id: number;
  title: string;
  thumb: string | null; // Optional base64 encoded thumbnail
  duration?: number; // Duration in minutes
  description: string;
  contacts: Contact[]; // Associated contacts/instructors
  skills: Skill[]; // Associated bonus skills
};

// Type definition for parcours (learning path) with associated resources
export type Parcours = {
  id: number;
  formationId: number;
  contacts: Contact[]; // Available instructors/contacts for the parcours
  bonusSkills: Skill[]; // Available bonus skills that can be earned
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
  thumb: string | null;
  metadatas: Metadatas[];
};

export type DuplicatedModule = {
  id: number;
  description: string;
  thumb: string | null;
  title: string;
  metadatas: Metadatas[];
};

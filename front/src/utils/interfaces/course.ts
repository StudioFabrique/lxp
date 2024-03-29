import Contact from "./contact";
import CourseDates from "./course-dates";
import Lesson from "./lesson";
import Module from "./module";
import Skill from "./skill";
import Tag from "./tag";

export default interface Course {
  id: number;
  title: string;
  description?: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  module: Module;
  tags: Tag[];
  virtualClass?: string;
  visibility?: boolean;
  image?: string;
  contacts: Contact[];
  scenario?: boolean;
  lessons: Lesson[];
  dates: CourseDates[];
  isPublished: boolean;
  bonusSkills: Skill[];
}

import Contact from "./contact";
import Lesson from "./lesson";
import Module from "./module";
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
  synchroneDuration?: number;
  asynchroneDuration?: number;
}

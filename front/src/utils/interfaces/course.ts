import Contact from "./contact";
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
  image?: string;
  contacts: Contact[];
}

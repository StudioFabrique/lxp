import Module from "./module";

export default interface Course {
  id: number;
  title: string;
  description?: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  module: Module;
}

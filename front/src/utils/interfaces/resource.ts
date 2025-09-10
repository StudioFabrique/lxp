import Tag from "./tag";

export default interface Resource {
  id: number;
  title: string;
  description: string;
  tags: Tag[];
}

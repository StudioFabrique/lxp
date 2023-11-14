import Tag from "./tag";

export default interface Formation {
  id?: number;
  title: string;
  level: string;
  code: string;
  tags: Array<Tag>;
}

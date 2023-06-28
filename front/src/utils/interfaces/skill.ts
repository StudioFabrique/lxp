import Badge from "./badge";

export default interface Skill {
  id: number;
  title: string;
  description?: string;
  badge?: Badge;
}

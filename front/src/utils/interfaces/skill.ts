import Badge from "./badge";

export default interface Skill {
  id?: number;
  description: string;
  badge?: Badge;
  createdAt?: string;
  updatedAt?: string;
}

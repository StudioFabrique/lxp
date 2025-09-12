import { Activity } from "./activity";
import Tag from "./tag";

export default interface Resource {
  id: number;
  title: string;
  description: string;
  tags: Tag[];
  activities: Activity[];
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

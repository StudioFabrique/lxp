import { Activity } from "../../../utils/interfaces/activity";
import Tag from "../../../utils/interfaces/tag";

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

import Tag from "./tag";

export default interface Resource {
  id: number;
  title: string;
  description: string;
  tags: Tag[];
  bonusActivities: BonusActivity[];
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BonusActivity {
  id: number;
  title: string;
  type: "text" | "video" | "fichier" | "image";
  description: string;
  url: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

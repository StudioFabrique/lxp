import Tag from "./tag";

export default interface Resource {
  id: number;
  title: string;
  description: string;
  tags: Tag[];
  bonusActivities: bonusActivity[];
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface bonusActivity {
  id: number;
  title: string;
  description: string;
  url: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

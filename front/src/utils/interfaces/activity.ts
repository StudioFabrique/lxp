export default interface Activity {
  id: number;
  url: string;
  type: "text" | "video" | "image";
  order: number;
  title?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

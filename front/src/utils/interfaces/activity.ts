export default interface Activity {
  id?: number;
  url: string;
  type: "text" | "video";
  order: number;
  title?: string;
  description?: string;
}

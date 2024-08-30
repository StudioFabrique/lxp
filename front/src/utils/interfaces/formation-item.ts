export default interface FormationItem {
  id: number;
  title: string;
  description?: string;
  code: string;
  level: string;
  parcours: number;
  createdAt: string;
  tags?: number[];
}

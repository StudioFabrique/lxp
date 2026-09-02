export default interface ParcoursSummary {
  id: number;
  title: string;
  startDate: string | null;
  endDate: string | null;
  isPublished: boolean;
  thumb: string | null;
  canManage?: boolean;
}

export interface FormationParcoursSummary {
  id: number;
  title: string;
  level: string;
  parcours: ParcoursSummary[];
  canManage?: boolean;
}

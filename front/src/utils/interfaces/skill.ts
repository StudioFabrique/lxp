export default interface Skill {
  id?: number;
  description: string;
  badge?: string;
  isEarned?: boolean;
  completedModules?: number;
  totalModules?: number;
  modules?: {
    id: number;
    title: string;
    progress: number;
    isCompleted: boolean;
  }[];
  createdAt?: string;
  updatedAt?: string;
  isBonus?: boolean;
  isSelected?: boolean;
}

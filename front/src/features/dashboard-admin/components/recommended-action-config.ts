import {
  BookPlus,
  ImagePlus,
  ShieldPlus,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";
import type { ComponentType } from "react";

export type RecommendedAction = {
  id: string;
  title: string;
  description: string;
  to: string;
  icon: ComponentType<{ className?: string }>;
};

export const recommendedActionIcons = {
  inviteTeachers: UserRoundPlus,
  createAdmin: ShieldPlus,
  changeLogo: ImagePlus,
  inviteStudents: UserRoundPlus,
  createGroup: UsersRound,
  createModule: BookPlus,
};

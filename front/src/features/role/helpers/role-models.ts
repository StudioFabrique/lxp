import { GraduationCap, ShieldCheck, UserRound, UsersRound } from "lucide-react";

export const roleModels = [
  { name: "Administrateur", rank: 1, icon: ShieldCheck },
  { name: "Équipe pédagogique", rank: 2, icon: UsersRound },
  { name: "Apprenant", rank: 3, icon: GraduationCap },
  { name: "Visiteur", rank: 4, icon: UserRound },
];

export const roleModelIcons: Record<number, typeof UserRound> = Object.fromEntries(
  roleModels.map(({ rank, icon }) => [rank, icon]),
);

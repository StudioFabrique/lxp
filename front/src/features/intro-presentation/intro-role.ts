import type { LucideIcon } from "lucide-react";
import { BookOpen, GraduationCap, ShieldCheck, Terminal } from "lucide-react";

import type Role from "../../utils/interfaces/role";

/** Espaces montrés par la séquence « dashboards » : apprenant ou équipe (rangs 0 à 2). */
export type IntroSpace = "student" | "team";

export type IntroRoleOption = {
  rank: number;
  label: string;
  /** Intitulé de l'espace dans la séquence (sous-titre de la barre latérale et de l'en-tête). */
  spaceLabel: string;
  icon: LucideIcon;
};

/**
 * Rôles de la plateforme dans l'ordre des rangs (0 = le plus élevé). La liste
 * est volontairement complète : l'API ne renvoie que les rôles gérables par
 * l'utilisateur, alors que la détection parcourt tous les rôles existants.
 */
export const INTRO_ROLES: readonly IntroRoleOption[] = [
  { rank: 0, label: "Root", spaceLabel: "Espace root", icon: Terminal },
  { rank: 1, label: "Administrateur", spaceLabel: "Espace administrateur", icon: ShieldCheck },
  { rank: 2, label: "Équipe pédagogique", spaceLabel: "Espace pédagogique", icon: BookOpen },
  { rank: 3, label: "Apprenant", spaceLabel: "Espace apprenant", icon: GraduationCap },
];

const STUDENT_RANK = 3;

/** Rôle principal de l'utilisateur, ou `null` s'il n'est pas dans la liste connue. */
export const findIntroRole = (
  roles: ReadonlyArray<Pick<Role, "rank">> | undefined,
): IntroRoleOption | null => {
  const rank = roles?.[0]?.rank;
  return INTRO_ROLES.find((role) => role.rank === rank) ?? null;
};

export const getIntroSpace = (role: IntroRoleOption): IntroSpace =>
  role.rank === STUDENT_RANK ? "student" : "team";

/**
 * Ordre dans lequel le sélecteur visite les rôles : un tour de liste, puis
 * l'arrêt sur le rôle détecté.
 */
export const buildIntroRoleSweep = (
  roleCount: number,
  targetIndex: number,
): number[] =>
  Array.from(
    { length: roleCount + targetIndex + 1 },
    (_, step) => step % roleCount,
  );

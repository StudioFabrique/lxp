import type { FormationParcoursSummary } from "../../interfaces/parcours-summary";

export type OnboardingStepId =
  | "invite-teacher"
  | "create-formation"
  | "create-content"
  | "enroll-students"
  | "publish"
  | "add-admin";

export type OnboardingStep = {
  id: OnboardingStepId;
  title: string;
  description: string;
  isDone: boolean;
  /** Une étape optionnelle ne compte pas dans la progression. */
  isOptional?: boolean;
  /** Une étape verrouillée dépend d'une étape précédente non terminée. */
  isLocked: boolean;
  lockedReason?: string;
};

type Options = {
  /** L'équipe pédagogique n'a pas à s'inviter elle-même : l'étape est alors acquise. */
  isTeacher: boolean;
  teachersCount?: number;
  studentsCount?: number;
  groupsCount?: number;
  /** Seul le compte principal peut ajouter un administrateur : l'étape optionnelle lui est réservée. */
  canAddAdmin?: boolean;
  adminsCount?: number;
  modulesCount: number;
  formations: FormationParcoursSummary[];
};

/**
 * Étapes de mise en route, dans l'ordre des dépendances réelles : sans membre de l'équipe
 * pédagogique on ne publie pas, un parcours se rattache à une formation, et on ne publie
 * qu'un parcours qui existe.
 */
export function buildOnboardingSteps({
  isTeacher,
  teachersCount,
  studentsCount,
  groupsCount,
  canAddAdmin = false,
  adminsCount,
  modulesCount,
  formations,
}: Options): OnboardingStep[] {
  const parcours = formations.flatMap((formation) => formation.parcours);
  const hasFormation = formations.length > 0;
  const hasContent = parcours.length > 0 && modulesCount > 0;

  return [
    {
      id: "invite-teacher",
      title: "Inviter un membre de l'équipe pédagogique",
      description: "Sans lui, il est impossible de publier un parcours.",
      isDone: isTeacher || (teachersCount ?? 0) > 0,
      isLocked: false,
    },
    {
      id: "create-formation",
      title: "Créer la formation, avec ses tags",
      description:
        "Les tags de la formation sont repris par ses parcours, puis par leurs cours.",
      isDone: hasFormation,
      isLocked: false,
    },
    {
      id: "create-content",
      title: "Créer un parcours, un module et un cours",
      description: "Un parcours est toujours rattaché à une formation.",
      isDone: hasContent,
      isLocked: !hasFormation,
      lockedReason: "Créez d'abord une formation.",
    },
    {
      id: "enroll-students",
      title: "Inscrire des apprenants",
      description: "Invitez des utilisateurs ou réunissez-les dans un groupe.",
      isDone: (studentsCount ?? 0) > 0 || (groupsCount ?? 0) > 0,
      // Les groupes d'apprenants se créent depuis un parcours.
      isLocked: !hasContent,
      lockedReason: "Créez d'abord un parcours : les groupes d'apprenants lui sont rattachés.",
    },
    {
      id: "publish",
      title: "Publier",
      description: "Rendez un parcours visible par ses apprenants.",
      isDone: parcours.some((item) => item.isPublished),
      isLocked: !hasContent,
      lockedReason: "Créez d'abord un parcours avec un module et un cours.",
    },
    ...(canAddAdmin
      ? [
          {
            id: "add-admin" as const,
            title: "Ajouter un administrateur supplémentaire",
            description:
              "Un second compte administrateur évite de dépendre d'une seule personne.",
            isDone: (adminsCount ?? 0) > 0,
            isOptional: true,
            isLocked: false,
          },
        ]
      : []),
  ];
}

import type { FormationParcoursSummary } from "../interfaces/parcours-summary";
import {
  recommendedActionIcons,
  type RecommendedAction,
} from "./recommended-action-config";

type Options = {
  userRank: number;
  teachersCount?: number;
  adminsCount?: number;
  studentsCount?: number;
  groupsCount?: number;
  parcours: FormationParcoursSummary[];
};

/** Construit les recommandations dans l'ordre métier affiché au dashboard. */
export function buildRecommendedActions({
  userRank,
  teachersCount,
  adminsCount,
  studentsCount,
  groupsCount,
  parcours,
}: Options): RecommendedAction[] {
  if (userRank <= 1) {
    return [
      ...(teachersCount === 0
        ? [
            {
              id: "invite-teachers",
              title: "Inviter l'équipe pédagogique",
              description: "Créez le premier compte formateur.",
              to: "/admin/user/add?roleRank=2&invite=true&tutorial=teacher",
              icon: recommendedActionIcons.inviteTeachers,
            },
          ]
        : []),
      ...(userRank === 0 && adminsCount === 0
        ? [
            {
              id: "create-admin",
              title: "Créer un administrateur",
              description: "Ajoutez un administrateur supplémentaire.",
              to: "/admin/user/add?roleRank=1&tutorial=admin",
              icon: recommendedActionIcons.createAdmin,
            },
          ]
        : []),
      {
        id: "change-logo",
        title: "Changer le logo de l'organisme",
        description: "Personnalisez l'identité visuelle de la plateforme.",
        to: "/admin/profil?tutorial=logo",
        icon: recommendedActionIcons.changeLogo,
      },
    ];
  }

  if (userRank !== 2) return [];

  const firstManagedParcours = parcours
    .flatMap((formation) => formation.parcours)
    .find((item) => item.canManage !== false);

  return [
    ...(studentsCount === 0
      ? [
          {
            id: "invite-students",
            title: "Inviter des apprenants",
            description: "Créez les premiers comptes apprenants.",
            to: "/admin/user/add?roleRank=3&invite=true&tutorial=student",
            icon: recommendedActionIcons.inviteStudents,
          },
        ]
      : []),
    ...(groupsCount === 0
      ? [
          {
            id: "create-group",
            title: "Créer un groupe d'apprenants",
            description: "Réunissez les apprenants dans un groupe.",
            to: "/admin/group/add?tutorial=group",
            icon: recommendedActionIcons.createGroup,
          },
        ]
      : []),
    ...(firstManagedParcours
      ? [
          {
            id: "create-module",
            title: "Créer mon premier module",
            description: "Ajoutez un module à l'un de vos parcours.",
            to: `/admin/parcours/edit/${firstManagedParcours.id}?step=4&create=true&tutorial=module`,
            icon: recommendedActionIcons.createModule,
          },
        ]
      : []),
  ];
}

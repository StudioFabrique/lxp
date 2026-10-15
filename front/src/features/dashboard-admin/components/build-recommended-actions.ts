import type { FormationParcoursSummary } from "../interfaces/parcours-summary";
import {
  recommendedActionIcons,
  type RecommendedAction,
} from "./recommended-action-config";
import {
  DEFAULT_ROLE_LABELS,
  type RoleLabels,
} from "../../role/helpers/role-labels";

type Options = {
  userRank: number;
  teachersCount?: number;
  adminsCount?: number;
  studentsCount?: number;
  groupsCount?: number;
  hasLogo?: boolean;
  /** Libellés des rôles de l'instance ; les valeurs par défaut s'appliquent sans eux. */
  roleLabels?: RoleLabels;
  parcours: FormationParcoursSummary[];
};

/** Construit les recommandations dans l'ordre métier affiché au dashboard. */
export function buildRecommendedActions({
  userRank,
  teachersCount,
  adminsCount,
  studentsCount,
  groupsCount,
  hasLogo,
  roleLabels = DEFAULT_ROLE_LABELS,
  parcours,
}: Options): RecommendedAction[] {
  if (userRank <= 1) {
    return [
      ...(userRank === 0 && adminsCount === 0
        ? [
            {
              id: "create-admin",
              title: `Créer un compte « ${roleLabels[1]} »`,
              description: `Ajoutez un compte « ${roleLabels[1]} » supplémentaire.`,
              to: "/admin/user/add?roleRank=1",
              icon: recommendedActionIcons.createAdmin,
            },
          ]
        : []),
      ...(teachersCount === 0
        ? [
            {
              id: "invite-teachers",
              title: `Inviter les membres « ${roleLabels[2]} »`,
              description: `Créez le premier compte « ${roleLabels[2]} ».`,
              to: "/admin/user/add?roleRank=2&invite=true",
              icon: recommendedActionIcons.inviteTeachers,
            },
          ]
        : []),
      ...(userRank === 0 && hasLogo === false
        ? [
            {
              id: "change-logo",
              title: "Changer le logo de l'organisme",
              description:
                "Personnalisez l'identité visuelle de la plateforme.",
              to: "/admin/parametres-instance",
              icon: recommendedActionIcons.changeLogo,
            },
          ]
        : []),
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
            to: "/admin/user/add?roleRank=3&invite=true",
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
            to: "/admin/group/add",
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
            to: `/admin/parcours/edit/${firstManagedParcours.id}?step=4&create=true`,
            icon: recommendedActionIcons.createModule,
          },
        ]
      : []),
  ];
}

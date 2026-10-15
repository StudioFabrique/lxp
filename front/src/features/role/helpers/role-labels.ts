/** Rangs dont le libellé est personnalisable (le rang 0, root, ne l'est pas). */
export const ROLE_LABEL_RANKS = [1, 2, 3, 4] as const;
export type RoleLabelRank = (typeof ROLE_LABEL_RANKS)[number];
export type RoleLabels = Record<RoleLabelRank, string>;

export const DEFAULT_ROLE_LABELS: RoleLabels = {
  1: "Administrateur",
  2: "Équipe pédagogique",
  3: "Apprenant",
  4: "Visiteur",
};

/** Clés du formulaire de personnalisation, associées à leur rang. */
export const ROLE_LABEL_FIELDS = {
  admin: 1,
  team: 2,
  student: 3,
  visitor: 4,
} as const satisfies Record<string, RoleLabelRank>;
export type RoleLabelFieldName = keyof typeof ROLE_LABEL_FIELDS;

export type RoleLabelsFormValues = Record<RoleLabelFieldName, string>;

export const ROLE_LABEL_MIN_LENGTH = 2;
export const ROLE_LABEL_MAX_LENGTH = 40;

const isRoleLabelRank = (rank: number): rank is RoleLabelRank =>
  ROLE_LABEL_RANKS.some((item) => item === rank);

/** Complète les libellés reçus de l'API : un libellé absent reprend sa valeur par défaut. */
export function resolveRoleLabels(
  saved?: Partial<Record<string, string>>,
): RoleLabels {
  const resolve = (rank: RoleLabelRank) => {
    const value = saved?.[rank]?.trim();
    return value ? value : DEFAULT_ROLE_LABELS[rank];
  };
  return {
    1: resolve(1),
    2: resolve(2),
    3: resolve(3),
    4: resolve(4),
  };
}

/** Libellé affiché pour un rang ; `fallback` sert aux rangs non personnalisables (root, rôles inconnus). */
export function getRoleLabelForRank(
  labels: RoleLabels,
  rank: number,
  fallback = "",
): string {
  return isRoleLabelRank(rank) ? labels[rank] : fallback;
}

export function roleLabelsToFormValues(labels: RoleLabels): RoleLabelsFormValues {
  return {
    admin: labels[ROLE_LABEL_FIELDS.admin],
    team: labels[ROLE_LABEL_FIELDS.team],
    student: labels[ROLE_LABEL_FIELDS.student],
    visitor: labels[ROLE_LABEL_FIELDS.visitor],
  };
}

/** Forme attendue par l'API : un libellé par rang. */
export function formValuesToRoleLabels(values: RoleLabelsFormValues): RoleLabels {
  return {
    1: values.admin,
    2: values.team,
    3: values.student,
    4: values.visitor,
  };
}

/** « équipe pédagogique » dans une phrase : le libellé choisi par l'instance, en minuscules. */
export const toInlineRoleLabel = (label: string): string =>
  label.toLocaleLowerCase("fr");

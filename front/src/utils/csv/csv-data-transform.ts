export function transformRolesCsv(
  roles: {
    role: string;
    label: string;
    countRead?: number;
    countWrite?: number;
    countUpdate?: number;
    countDelete?: number;
  }[],
) {
  return roles.map((role) => {
    return {
      "nom du role": role.role,
      "label du role": role.label,
      "nb permissions de lecture": role.countRead || 0,
      "nb permissions d'écriture": role.countWrite || 0,
      "nb permissions d'édition": role.countUpdate || 0,
      "nb permissions de suppression": role.countDelete || 0,
    };
  });
}

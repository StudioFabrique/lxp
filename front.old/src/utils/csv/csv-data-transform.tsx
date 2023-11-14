import { IRoleItem } from "../../views/role/role";

export function transformRolesCsv(roles: IRoleItem[]) {
  return roles.map((role) => {
    return {
      "nom du role": role.role,
      "label du role": role.label,
      "Role actif": role.isActive,
      "nb permissions de lecture": role.permCount.read,
      "nb permissions d'écriture": role.permCount.write,
      "nb permissions d'édition": role.permCount.update,
      "nb permissions de suppression": role.permCount.delete,
    };
  });
}

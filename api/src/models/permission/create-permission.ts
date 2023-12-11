import Permission from "../../utils/interfaces/db/permission";
import Role, { IRole } from "../../utils/interfaces/db/role";
import { ressourcesRbacByRank } from "../../config/ressources-rbac";

export default async function CreatePermission(
  role: string,
  rank: number,
  action: string,
  duplicateForAdmins?: IRole[]
) {
  const ressources = async () => {
    switch (rank) {
      case 1:
        return [
          ...ressourcesRbacByRank[rank],
          ...(await Role.find()).map((role) => role.role),
        ];
      case 2:
        return [
          ...ressourcesRbacByRank[rank],
          ...(action === "read"
            ? (await Role.find()).map((role) => role.role)
            : []),
        ];
      case 3:
        return action === "read" ? [...ressourcesRbacByRank[rank]] : [];
      case 4:
        return [];
      default:
        return [];
    }
  };

  await Permission.create({
    role,
    action: action,
    ressources: await ressources(),
  });

  if (duplicateForAdmins)
    for (const adminRole of duplicateForAdmins)
      await Permission.updateMany(
        { role: adminRole.role, action: action },
        {
          $push: { ressources: role },
        }
      );
}

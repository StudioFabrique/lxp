import Permission from "../../utils/interfaces/db/permission";
import Role from "../../utils/interfaces/db/role";
import { ressourcesRbacByRank } from "../../utils/ressources-rbac";

export default async function CreatePermission(
  role: string,
  rank: number,
  action: string
) {
  console.log({ role }, { rank }, { action });

  const ressources = async () => {
    switch (rank) {
      case 1:
        console.log("rank 1 passed");

        return [
          ...ressourcesRbacByRank[rank],
          ...(await Role.find()).map((role) => role.role),
        ];
      case 2:
        console.log("rank 2 passed");
        return [
          ...ressourcesRbacByRank[rank],
          ...(action === "read"
            ? (await Role.find()).map((role) => role.role)
            : []),
        ];
      case 3:
        console.log("rank 3 passed");
        return action === "read" ? [...ressourcesRbacByRank[rank]] : [];
      case 4:
        console.log("rank 4 passed");
        return [];
      default:
        console.log("rank no passed");
        return [];
    }
  };

  await Permission.create({
    role,
    action: action,
    ressources: await ressources(),
  });
}

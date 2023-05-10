import { IRole } from "../utils/interfaces/db/role";
import getPermissions from "../utils/services/permissions/accessControl";

async function hasPermission(role: IRole, action: string, resource: string) {
  try {
    console.log({ role, action, resource });

    const ac = await getPermissions();
    switch (action) {
      case "read":
        const permission = ac.can(role.role).readAny(resource);
        if (permission.granted) {
          return true;
        }
    }
  } catch (err) {
    console.log(err);

    return false;
  }
}

export default hasPermission;

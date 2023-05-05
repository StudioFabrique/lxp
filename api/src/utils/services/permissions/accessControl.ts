import { AccessControl } from "accesscontrol";
import Permission from "../../interfaces/db/permission";

async function getPermissions() {
  const grantArray = Array<any>();
  const permissions = await Permission.find({});
  for (let perm of permissions) {
    grantArray.push({
      role: perm.role,
      action: perm.action,
      resource: perm.resource,
      attributes: perm.attributes,
    });
  }

  return new AccessControl(grantArray);
}

export default getPermissions;

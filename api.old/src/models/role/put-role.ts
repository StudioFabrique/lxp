import Permission, { IPermission } from "../../utils/interfaces/db/permission";
import Role from "../../utils/interfaces/db/role";

export async function putRole(
  idRole: string,
  permissions: IPermission[],
  role: string,
  label: string,
  rank: number,
  isActive: boolean
) {
  try {
    const oldRole = await Role.findOneAndUpdate(
      { _id: idRole },
      { role, label, rank, isActive }
    );

    if (Boolean(permissions))
      for (const permission of permissions) {
        await Permission.updateOne(
          { role: oldRole?.role, action: permission.action },
          { ressources: permission.ressources }
        );
      }

    if (Boolean(role))
      await Permission.updateMany({ role: oldRole?.role }, { role });

    const roleUpdated = await Role.findOne({ _id: idRole });

    return roleUpdated;
  } catch (error) {
    console.log(error);
    return null;
  }
}

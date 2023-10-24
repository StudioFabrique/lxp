import { Request, Response } from "express";
import Permission, { IPermission } from "../../utils/interfaces/db/permission";
import Role from "../../utils/interfaces/db/role";
import { serverIssue } from "../../utils/constantes";

/**
 * Mets à jour le nom d'un rôle ainsi que toutes ses permissions
 */
export default async function httpPutRole(req: Request, res: Response) {
  try {
    const idRole: string = req.params.id;

    const {
      role,
      label,
      isActive,
      permissions,
    }: {
      role: string;
      label: string;
      isActive: boolean;
      permissions: IPermission[];
    } = req.body;

    const oldRole = await Role.findOneAndUpdate(
      { _id: idRole },
      { role, label, isActive }
    );

    if (!!permissions)
      for (const permission of permissions) {
        await Permission.updateOne(
          { role: oldRole?.role, action: permission.action },
          { ressources: permission.ressources }
        );
      }

    if (!!role) await Permission.updateMany({ role: oldRole?.role }, { role });

    const roleUpdated = await Role.findOne({ _id: idRole });

    return res.status(200).json({
      message: "Mise à jour effectuée avec succès",
      data: roleUpdated,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: serverIssue });
  }
}

import { Request, Response } from "express";
import Permission, { IPermission } from "../../utils/interfaces/db/permission";
import { serverIssue } from "../../utils/constantes";
import { putRole } from "../../models/role/put-role";

/**
 * Mets à jour le nom d'un rôle ainsi que toutes ses permissions
 */
export default async function httpPutRole(req: Request, res: Response) {
  try {
    const idRole: string = req.params.id;

    const {
      role,
      label,
      rank,
      isActive,
      permissions,
    }: {
      role: string;
      label: string;
      rank: number;
      isActive: boolean;
      permissions: IPermission[];
    } = req.body;

    const roleUpdated = await putRole(
      idRole,
      permissions,
      role && role.toLocaleLowerCase().trim(),
      label && label.toLocaleLowerCase().trim(),
      rank,
      isActive
    );

    return res.status(200).json({
      message: "Mise à jour effectuée avec succès",
      data: roleUpdated,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: serverIssue });
  }
}

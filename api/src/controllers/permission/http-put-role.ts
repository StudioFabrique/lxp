import { Request, Response } from "express";
import Permission from "../../utils/interfaces/db/permission";
import Role, { IRole } from "../../utils/interfaces/db/role";

/**
 * Mets à jour le nom d'un rôle ainsi que toutes ses permissions
 */
export default async function httpPutRole(req: Request, res: Response) {
  try {
    const idRole: string = req.params.id;

    const role: string = req.body.role;

    const oldRole = await Role.findOneAndUpdate({ _id: idRole }, { role });

    await Permission.updateMany({ role: oldRole?.role }, { role });

    return res
      .status(200)
      .json({ message: "mise à jour effectuée avec succès" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Problème serveur" });
  }
}

import { Request, Response } from "express";
import Permission from "../../utils/interfaces/db/permission";
import Role from "../../utils/interfaces/db/role";

/**
 * Supprime un rôle ainsi que toutes ses permissions
 */
export default async function httpDeleteRole(req: Request, res: Response) {
  try {
    const role: string = req.params.role;

    await Permission.deleteMany({ role: role });

    await Role.deleteMany({ role: role });

    return res
      .status(200)
      .json({ message: "suppression effectué avec succès" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Problème serveur" });
  }
}

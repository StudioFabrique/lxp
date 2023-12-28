import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import Role from "../../utils/interfaces/db/role";
import { ressourcesRbac } from "../../config/ressources-rbac";

export default async function httpGetRessources(req: Request, res: Response) {
  try {
    const roles = await Role.find();

    const ressources = {
      ressources: ressourcesRbac,
      roles: roles.map((role) => role.role),
    };

    if (!ressources || ressources.ressources.length <= 0) {
      return res
        .status(404)
        .json({ message: "aucune ressources n'a été trouvé" });
    }

    return res.status(200).json({ data: ressources });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: serverIssue });
  }
}

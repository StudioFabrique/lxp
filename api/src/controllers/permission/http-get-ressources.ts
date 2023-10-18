import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import Role from "../../utils/interfaces/db/role";

export default async function httpGetRessources(req: Request, res: Response) {
  try {
    console.log("test log");
    const ressourcesDef = ["tag", "role", "parcours"];

    const roles = await Role.find();

    const ressources: string[] = [
      ...ressourcesDef,
      ...roles.map((role) => role.role),
    ];

    console.log("ressources :");

    console.log(ressources);

    if (!ressources || ressources.length <= 0) {
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

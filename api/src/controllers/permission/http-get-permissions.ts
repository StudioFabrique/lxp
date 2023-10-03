import { Request, Response } from "express";
import Permission from "../../utils/interfaces/db/permission";

export default async function httpGetPermissions(req: Request, res: Response) {
  try {
    const role: string = req.params.role;

    const permissions = await Permission.find({ role });

    if (!permissions) {
      return res
        .status(404)
        .json({ message: "aucune permissions n'a été trouvé" });
    }

    console.log(permissions);

    return res.status(200).json({ data: permissions });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Problème serveur" });
  }
}

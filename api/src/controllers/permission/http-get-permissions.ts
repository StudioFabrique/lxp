import { Request, Response } from "express";
import Permission from "../../utils/interfaces/db/permission";

export default async function httpGetPermissions(req: Request, res: Response) {
  const { role } = req.query;

  const permissions = Permission.find({ role });

  if (!permissions) {
    return res
      .status(404)
      .json({ message: "aucune permissions n'a été trouvé" });
  }

  return res.status(200).json(permissions);
}

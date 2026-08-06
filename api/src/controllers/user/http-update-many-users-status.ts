import { type Request, type Response } from "express";
import { noData, serverIssue } from "../../utils/constantes.ts";
import updateManyUsersStatus from "../../models/user/update-many-users-status.ts";
import { validationResult } from "express-validator";

async function httpUpdateManyUsersStatus(req: Request, res: Response) {
  try {
    const result = validationResult(req);

    if (!result.isEmpty())
      return res.status(400).json({ errors: result.array() });

    const { usersIds, status } = req.body;

    const response = await updateManyUsersStatus(usersIds, status);
    if (!response) {
      return res.status(404).json({ message: noData });
    }
    return res
      .status(201)
      .json({ message: "Status des utilisateurs modifié avec succès!" });
  } catch (error) {
    return res.status(500).json({ message: serverIssue + error });
  }
}

export default httpUpdateManyUsersStatus;

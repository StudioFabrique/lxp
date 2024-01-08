import { Request, Response } from "express";
import { noData, serverIssue } from "../../utils/constantes";
import updateManyUsersStatus from "../../models/user/update-many-users-status";

async function httpUpdateManyUsersStatus(req: Request, res: Response) {
  try {
    const { usersIds, status } = req.body;

    const result = await updateManyUsersStatus(usersIds, status);
    if (!result) {
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

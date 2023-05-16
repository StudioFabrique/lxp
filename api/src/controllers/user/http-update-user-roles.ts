import { Request, Response } from "express";
import { badQuery, serverIssue } from "../../utils/constantes";
import { validationResult } from "express-validator";
import updateUserRoles from "../../models/user/update-user-roles";

async function httpUpdateUserRoles(req: Request, res: Response) {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ message: badQuery });
    }

    const { usersToUpdate, rolesId } = req.body;
    const updatedUsers = await updateUserRoles(usersToUpdate, rolesId);
    if (!updatedUsers) {
      return res.status(418).json({ message: badQuery });
    }
    return res
      .status(201)
      .json({ message: "Roles des utilisateurs mis à jour avec succès." });
  } catch (err) {
    return res.status(500).json({ message: serverIssue + err });
  }
}

export default httpUpdateUserRoles;

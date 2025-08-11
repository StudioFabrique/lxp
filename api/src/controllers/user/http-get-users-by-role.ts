import { Response } from "express";
import { badQuery, serverIssue } from "../../utils/constantes";
import { validationResult } from "express-validator";
import getUsersByRole from "../../models/user/get-users-by-role";
import CustomRequest from "../../utils/interfaces/express/custom-request";

async function httpGetUsersByRole(req: CustomRequest, res: Response) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  try {
    const { role, stype, sdir } = req.params;
    const { page, limit } = req.query;
    const userRole = req.auth?.userRoles[0];

    if (!userRole) {
      throw {
        message:
          "L'utilisateur n'est pas  autorisé à accéder à ces ressources.",
        statusCode: 401,
      };
    }

    const result = await getUsersByRole(+page!, +limit!, role, stype, sdir);

    if (!result) {
      return res.status(400).json({ message: badQuery });
    }

    return res.status(200).json({ total: result!.total, list: result!.users });
  } catch (err: any) {
    return res
      .status(err.statusCode ?? 500)
      .json({ message: err.message ?? serverIssue });
  }
}

export default httpGetUsersByRole;

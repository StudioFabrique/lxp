import { type Response } from "express";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import getUsersByGroup from "../../models/user/get-users-by-group.ts";
import { serverIssue } from "../../utils/constantes.ts";

async function httpGetUsersByGroup(req: CustomRequest, res: Response) {
  const groupsIds = req.body;

  try {
    const response = await getUsersByGroup(groupsIds);
    return res.status(200).json(response);
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpGetUsersByGroup;

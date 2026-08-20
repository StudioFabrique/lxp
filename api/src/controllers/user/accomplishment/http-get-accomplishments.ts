import { type Response } from "express";
import type CustomRequest from "../../../utils/interfaces/express/custom-request.ts";
import { noAccess, serverIssue } from "../../../utils/constantes.ts";
import getLastAccomplishments from "../../../models/user/accomplishments/get-last-accomplishments.ts";

/**
 *
 * @param req
 * @param res
 * @returns
 */
export default async function httpGetAccomplishements(
  req: CustomRequest,
  res: Response
) {
  try {
    if (!req.auth) {
      return res.status(403).json({ message: noAccess });
    }

    const { userId } = req.auth;

    const response = await getLastAccomplishments(userId);

    return res.status(200).json({ data: response });
  } catch (error) {

    return res.status(500).json({ message: serverIssue });
  }
}

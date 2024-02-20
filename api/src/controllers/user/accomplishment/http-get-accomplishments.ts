import { Response } from "express";
import CustomRequest from "../../../utils/interfaces/express/custom-request";
import { noAccess, serverIssue } from "../../../utils/constantes";
import getLastFeedback from "../../../models/user/feedback/get-last-feedback";
import getLastAccomplishments from "../../../models/user/accomplishments/get-last-accomplishments";

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
    console.log(error);

    return res.status(500).json({ message: serverIssue });
  }
}

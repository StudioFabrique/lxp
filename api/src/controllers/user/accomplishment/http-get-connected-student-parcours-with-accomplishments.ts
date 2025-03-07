import { Response } from "express";
import CustomRequest from "../../../utils/interfaces/express/custom-request";
import { noAccess, serverIssue } from "../../../utils/constantes";
import getStudentParcoursWithAccomplishments from "../../../models/user/accomplishments/get-student-parcours-with-accomplishments";

/**
 * Retourner les accomplissements de l'étudiant connecté
 * @param req
 * @param res
 * @returns
 */
export default async function httpGetConnectedStudentParcoursWithAccomplishements(
  req: CustomRequest,
  res: Response,
) {
  try {
    if (!req.auth) {
      return res.status(403).json({ message: noAccess });
    }

    const { userId } = req.auth;

    const response = await getStudentParcoursWithAccomplishments(userId);

    return res.status(200).json({ data: response });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: serverIssue });
  }
}

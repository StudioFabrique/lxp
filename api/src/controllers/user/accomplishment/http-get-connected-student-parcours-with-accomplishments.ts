import { type Response } from "express";
import type CustomRequest from "../../../utils/interfaces/express/custom-request.ts";
import { noAccess, serverIssue } from "../../../utils/constantes.ts";
import getStudentParcoursWithAccomplishments from "../../../models/user/accomplishments/get-student-parcours-with-accomplishments.ts";

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

    return res.status(500).json({ message: serverIssue });
  }
}

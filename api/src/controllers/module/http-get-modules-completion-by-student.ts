import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import getModulesCompletionByStudent from "../../models/module/get-modules-completion-by-student";

async function httpGetModulesCompletionByStudent(req: Request, res: Response) {
  const { studentId } = req.params;

  try {
    const response = await getModulesCompletionByStudent(studentId);
    return res.status(200).json({
      data: response,
      message: `La progression des modules de l'étudiant ${studentId} a bien été récupéré`,
    });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpGetModulesCompletionByStudent;

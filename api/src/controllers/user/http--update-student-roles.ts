import { Request, Response } from "express";
import { badQuery, serverIssue } from "../../utils/constantes";
import updateStudentRoles from "../../models/user/update-student-roles";

async function httpUpdateStudentRoles(req: Request, res: Response) {
  try {
    const studentsToUpdate = req.body;
    const updatedStudents = await updateStudentRoles(studentsToUpdate);
    if (!updatedStudents) {
      return res.status(400).json({ message: badQuery });
    }
    return res
      .status(201)
      .json({ message: "Roles des utilisateurs mis à jour avec succès." });
  } catch (err) {
    return res.status(500).json({ message: serverIssue + err });
  }
}

export default httpUpdateStudentRoles;

import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import updateStudentRoles from "../../models/user/update-student-roles";

async function httpUpdateStudentRoles(req: Request, res: Response) {
  const newRoles = req.body;
  const studentId = req.params.studentId;
  try {
    const updatedStudents = await updateStudentRoles(studentId, newRoles);
    console.log(updatedStudents);

    return res
      .status(200)
      .json({ message: "Roles des utilisateurs mis à jour avec succès." });
  } catch (err) {
    return res.status(500).json({ message: serverIssue + err });
  }
}

export default httpUpdateStudentRoles;

import bcrypt from "bcrypt";

import Student from "../../utils/interfaces/db/student/student.model";
import { hasRole } from "../../utils/services/permissions/hasRole";

async function studentLogin(email: string, password: string) {
  const student = await Student.findOne({ email: email }).populate("roles", {
    _id: 1,
    role: 1,
    label: 1,
    rank: 1,
  });

  // on vérifie les identifiants et on retourne les informations de l'utilisateur
  if (student && (await bcrypt.compare(password, student.password))) {
    if (hasRole(3, student.roles)) {
      return {
        id: student._id.toString(),
        email: student.email,
        roles: student.roles,
        avatar: student.avatar,
        createdAt: student.createdAt,
      };
    }
  }
  return false;
}

export default studentLogin;

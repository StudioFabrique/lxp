import bcrypt from "bcrypt";

import Student from "../../utils/interfaces/db/student/student.model";

async function studentLogin(email: string, password: string) {
  const student = await Student.findOne({ email: email });

  // on vérifie les identifiants et on retourne les informations de l'utilisateur
  if (student && (await bcrypt.compare(password, student.password))) {
    if (student.roles.includes("student")) {
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

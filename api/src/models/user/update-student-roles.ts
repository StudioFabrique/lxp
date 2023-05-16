import Role from "../../utils/interfaces/db/role";
import Student from "../../utils/interfaces/db/student/student.model";

async function updateStudentRoles(
  studentsToUpdate: Array<string>,
  rolesId: Array<string>
) {
  //  on récupère les roles avec les privilèges les plus élevés de chaques apprenant
  let actualStudents = await Student.find({ _id: studentsToUpdate }).populate(
    "roles",
    { rank: 1 }
  );

  if (!actualStudents) {
    return false;
  }

  console.log({ actualStudents });

  let roles = await Role.find({ _id: rolesId });

  //  on vérifie que les étuduants à modifier existent bien
  if (actualStudents.length !== studentsToUpdate.length) {
    return false;
  }

  // on vérifie que les roles qu'on veut attribuer aux étudiants soient bien attribuables
  for (let i = 0; i < studentsToUpdate.length; i++) {
    if (roles[0].rank !== actualStudents[i].roles[0].rank) {
      return false;
    }
  }

  //  on met les rôles des apprenants à jour
  const bulkUpdate = studentsToUpdate.map((student: string) => {
    return {
      updateOne: {
        filter: {
          _id: student,
        },
        update: {
          roles: roles,
        },
      },
    };
  });

  const updatedStudents = await Student.bulkWrite(bulkUpdate);

  return updatedStudents;
}

export default updateStudentRoles;

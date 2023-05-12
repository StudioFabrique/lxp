import Student, {
  IStudent,
} from "../../utils/interfaces/db/student/student.model";

async function updateStudentRoles(studentsToUpdate: Array<IStudent>) {
  const studentIds = studentsToUpdate.map((student) => student._id);

  //  on récupère les roles avec les privilèges les plus élevés de chaques apprenant
  let actualStudents = await Student.find({ _id: studentIds }).populate(
    "roles",
    { rank: 1 }
  );

  //  on vérifie que les étuduants à modifier existent bien
  if (actualStudents.length !== studentsToUpdate.length) {
    return false;
  }

  // on vérifie que les roles qu'on veut attribuer aux étudiants soient bien attribuables
  for (let i = 0; i < studentsToUpdate.length; i++) {
    if (studentsToUpdate[i].roles[0].rank !== actualStudents[i].roles[0].rank) {
      return false;
    }
  }

  //  on met les rôles des apprenants à jour
  const bulkUpdate = studentsToUpdate.map((student: IStudent) => {
    return {
      updateOne: {
        filter: {
          _id: student._id,
        },
        update: {
          roles: student.roles,
        },
      },
    };
  });

  const updatedStudents = await Student.bulkWrite(bulkUpdate);

  return updatedStudents;
}

export default updateStudentRoles;

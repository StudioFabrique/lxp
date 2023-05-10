import Student, {
  IStudent,
} from "../../utils/interfaces/db/student/student.model";

async function updateStudentRoles(users: Array<IStudent>) {
  const studentIds = users.map((user) => user.id);
  const updatedStudents = await Student.updateMany({ studentIds }, { users });
  return updatedStudents;
}

export default updateStudentRoles;

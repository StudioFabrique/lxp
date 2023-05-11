import { IRole } from "../../utils/interfaces/db/role";
import Student, {
  IStudent,
} from "../../utils/interfaces/db/student/student.model";

async function updateStudentRoles(studentId: string, roles: Array<IRole>) {
  const updatedStudent = await Student.findOneAndUpdate(
    { _id: new Object(studentId) },
    { roles: roles }
  );
  return updatedStudent;
}

export default updateStudentRoles;

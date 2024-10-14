import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";

export default async function deleteUser(userId: string) {
  await prisma.student.deleteMany({ where: { idMdb: userId } });
  await prisma.teacher.deleteMany({ where: { idMdb: userId } });
  await prisma.admin.deleteMany({ where: { idMdb: userId } });

  await User.deleteOne().where({ _id: userId });

  return;
}

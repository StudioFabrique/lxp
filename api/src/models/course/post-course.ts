import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";

async function postCourse(userId: string, course: any) {
  console.log({ course });

  const existingModule = await prisma.module.findFirst({
    where: { id: course.moduleId },
    select: { courses: true },
  });

  if (!existingModule) {
    const error = new Error("Le module n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const existingAdmin = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingAdmin) {
    const error: any = {
      message: "L'utilisateur n'existe pas.",
      statusCode: 400,
    };
    throw error;
  }

  const adminName = await User.findById(userId, { firstname: 1, lastname: 1 });

  if (!adminName) {
    const error: any = {
      message: "L'utilisateur n'existe pas.",
      statusCode: 400,
    };
    throw error;
  }

  const newCourse = await prisma.course.create({
    data: {
      title: course.title,
      module: {
        connect: {
          id: course.moduleId,
        },
      },
      author: `${adminName.firstname} ${adminName.lastname}`,
      admin: { connect: { id: existingAdmin.id } },
      // on place le nouveau cours en fin de liste des cours associés au module
      order: existingModule.courses.length,
    },
    select: { id: true },
  });

  return newCourse;
}

export default postCourse;

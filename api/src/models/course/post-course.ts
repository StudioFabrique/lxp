import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";
import { getUnsplashPresentationImage } from "../../helpers/unsplash-presentation-image";
import { slugify } from "../../helpers/slugify";

async function postCourse(userId: string, course: any) {
  const existingModule = await prisma.moduleMetadata.findFirst({
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
      message: "l'admin n'existe pas.",
      statusCode: 400,
    };
    throw error;
  }

  const adminName = await User.findById(userId, { firstname: 1, lastname: 1 });

  if (!adminName) {
    const error: any = {
      message: "L'utilisateur n'a pas de nom.",
      statusCode: 400,
    };
    throw error;
  }

  const defaultImage = await getUnsplashPresentationImage(course.title);
  const newCourse = await prisma.course.create({
    data: {
      title: course.title,
      image: defaultImage,
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

  // Backfill the slug (never set above, would stay NULL) so the course stays
  // visible to ANDRIA-AI, which filters out courses with no slug.
  await prisma.course.update({
    where: { id: newCourse.id },
    data: { courseSlug: `${slugify(course.title) || "cours"}-${newCourse.id}` },
  });

  return newCourse;
}

export default postCourse;

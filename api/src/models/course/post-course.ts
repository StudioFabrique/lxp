import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { prisma } from "../../utils/db.ts";
import User from "../../utils/interfaces/db/user.ts";
import { getUnsplashPresentationImage } from "../../helpers/unsplash-presentation-image.ts";
import { slugify } from "../../helpers/slugify.ts";

async function postCourse(userId: string, course: any) {
  const existingModule = await prisma.orm.public.Module.where({
    id: course.moduleId,
  })
    .include("courses")
    .first();

  if (!existingModule) {
    const error = new Error("Le module n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const existingAdmin = await prisma.orm.public.Admin.where({
    idMdb: userId,
  }).first();

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
  const newCourse = await prisma.orm.public.Course.select("id").create({
    title: course.title,
    image: defaultImage,
    module: (relation) =>
      relation.connect({
        id: course.moduleId,
      }),
    author: `${adminName.firstname} ${adminName.lastname}`,
    admin: (relation) => relation.connect({ id: existingAdmin.id }),
    order: existingModule.courses.length,
    dates: [],
  });

  // Backfill the slug (never set above, would stay NULL) so the course stays
  // visible to ANDRIA-AI, which filters out courses with no slug.
  await prisma.orm.public.Course.where({ id: newCourse.id })
    .update({
      courseSlug: `${slugify(course.title) || "cours"}-${newCourse.id}`,
    })
    .then(requireDatabaseRow);

  return newCourse;
}

export default postCourse;

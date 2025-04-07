import User from "../../utils/interfaces/db/user";
import { prisma } from "../../utils/db";
import { IRole } from "../../utils/interfaces/db/role";

export default async function getBestRatedCourses(userId: string) {
  // 1 Vérifier que userId is in Admin
  const admin = await prisma.admin.findFirst({
    where: {
      idMdb: userId,
    },
  });

  if (!admin) {
    throw new Error("User is not an admin");
  }

  // 2 Vérifier que role in roles === "teacher"
  const user = await User.findById(userId).populate("roles");

  if (!user) return null;

  if (!user.roles.some((role: IRole) => role.role === "teacher")) {
    throw new Error("User is not a teacher");
  }

  // 3 Récupérer la liste des cours et des leçons
  const courses = await prisma.course.findMany({
    where: {
      adminId: admin.id,
      lessons: { some: { lessonRating: { some: { rating: { gt: 0 } } } } },
    },
    take: 4,
    include: {
      lessons: {
        orderBy: {
          order: "asc",
        },
        include: {
          lessonRating: true,
        },
      },
    },
  });

  // 4 Faire la moyenne des notes de chaque cours
  const coursesRating = courses.map((course) => {
    const ratings = course.lessons.flatMap((lesson) =>
      lesson.lessonRating.map((rating) => rating.rating * 20),
    );
    const avg =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;
    return {
      firstLessonId: course.lessons[0]?.id,
      moduleId: course.moduleId,
      courseTitle: course.title,
      rating: avg,
    };
  });

  // 5 Calculer et retourner l'objet final
  const globalQualityRating =
    coursesRating.length > 0
      ? coursesRating.reduce((acc, curr) => acc + curr.rating, 0) /
        coursesRating.length
      : 0;

  return {
    globalQualityRating,
    coursesRating,
  };
}

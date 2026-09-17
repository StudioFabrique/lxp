import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";
import {
  moduleWhereForScope,
  type AccessScope,
} from "../../utils/services/permissions/accessible-parcours.ts";

export default async function getAllModules(scope: AccessScope = null) {
  const modules = await prisma.orm.public.Module.where((row) =>
    whereFromObject(row, moduleWhereForScope(scope)),
  )
    .select("id", "title", "thumb", "createdAt", "parcoursId")
    .include("parcours", (related147) =>
      related147
        .select("title")
        .include("formation", (related148) => related148.select("title")),
    )
    .include("courses", (related149) =>
      related149
        .select("id", "title", "order", "isPublished", "visibility")
        .include("lessons", (related150) =>
          related150
            .select("id")
            .orderBy((row) => row.order.asc())
            .limit(1),
        )
        .orderBy((row) => row.order.asc()),
    )
    .orderBy((row) => row.createdAt.desc())
    .all();

  return modules.map(({ parcours, courses, thumb, ...module }) => {
    const mappedCourses = courses.map(({ lessons, ...course }) => ({
      ...course,
      firstLessonId: lessons[0]?.id,
    }));

    return {
      ...module,
      thumb: thumb ? Buffer.from(thumb as any).toString("base64") : null,
      parcours: parcours!.title,
      formation: parcours!.formation!.title,
      coursesCount: courses.length,
      courses: mappedCourses,
    };
  });
}

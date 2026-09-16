import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";
import {
  moduleWhereForScope,
  type AccessScope,
} from "../../utils/services/permissions/accessible-parcours.ts";

export default async function getCoursesTimeline(
  minDate: string,
  maxDate: string,
  scope: AccessScope = null,
) {
  // Les cours suivent le périmètre du module ; aucun contact posé sur le cours
  // n'est requis pour un formateur déjà affecté au module.
  const courses = await prisma.orm.public.Course.where((row) =>
    whereFromObject(row, {
      isPublished: true,
      visibility: true,
      module: {
        ...(scope === null ? {} : moduleWhereForScope(scope)),
        OR: [
          {
            minDate: {
              lte: new Date(maxDate).toISOString(),
            },
            maxDate: {
              gte: new Date(minDate).toISOString(),
            },
          },
        ],
      },
    }),
  )
    .select("id", "title", "dates")
    .include("module", (related50) =>
      related50
        .select("id", "title")
        .include("parcours", (related51) =>
          related51
            .select("title")
            .include("formation", (related52) => related52.select("title")),
        ),
    )
    .include("lessons", (related53) => related53.select("id").limit(1))
    .all();

  const coursesFormatted = courses.reduce<any>((acc, course) => {
    for (const date of course.dates as {
      minDate: string;
      maxDate: string;
    }[]) {
      if (
        new Date(date.minDate) <= new Date(maxDate) &&
        new Date(date.maxDate) >= new Date(minDate)
      ) {
        acc.push({
          id: course.id,
          moduleId: course.module!.id,
          moduleTitle: course.module!.title,
          title: course.title,
          minDate: date.minDate,
          maxDate: date.maxDate,
          firstLessonId: course.lessons[0]?.id,
          parcoursTitle: course.module!.parcours?.title,
          formationTitle: course.module!.parcours?.formation?.title,
        });
      }
    }
    return acc;
  }, []);

  return coursesFormatted.sort((a: { minDate: string }, b: { minDate: string }) =>
    a.minDate.localeCompare(b.minDate),
  );
}

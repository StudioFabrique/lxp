import { prisma } from "../../utils/db.ts";
import { all, and } from "@prisma/orm-postgres/orm-client";
import { calculateCourseProgress } from "../../helpers/calculate-module-progress.ts";

async function getCoursesByModule(moduleId: number, userMdbId: string) {
  const teacherOrAdmin = await prisma.orm.public.Admin.where({
    idMdb: userMdbId,
  }).first();

  const courses = await prisma.orm.public.Course.where({
    moduleId,
    isPublished: teacherOrAdmin ? undefined : true,
    visibility: teacherOrAdmin ? undefined : true,
  })
    .select(
      "id",
      "title",
      "author",
      "createdAt",
      "updatedAt",
      "isPublished",
      "visibility",
    )
    .include("module", (related45) =>
      related45
        .select("id", "title", "description", "thumb")
        .include("parcours", (related46) => related46.select("id", "title")),
    )
    .include("lessons", (related47) =>
      related47
        .where((lesson) =>
          teacherOrAdmin
            ? all()
            : and(
                lesson.visibility.eq(true),
                lesson.activities.some((activity) => activity.id.gt(0)),
              ),
        )
        .select("id")
        .include("lessonsRead", (reads) =>
          reads
            .where((read) =>
              read.student.some((student) => student.idMdb.eq(userMdbId)),
            )
            .select("finishedAt"),
        )
        .orderBy((row) => row.order.asc()),
    )
    .include("assignment", (assignment) =>
      assignment.select("id").include("submissions", (submissions) =>
        submissions
          .where((submission) =>
            submission.student.some((student) => student.idMdb.eq(userMdbId)),
          )
          .select("submittedAt"),
      ),
    )
    .orderBy((row) => row.order.asc())
    .all();

  const result = courses.map((item) => ({
    id: item.id,
    title: item.title,
    module: item.module!.title,
    parcours: item.module!.parcours!.title,
    lessons: item.lessons.map(({ id, lessonsRead }) => ({ id, lessonsRead })),
    stats: { progress: calculateCourseProgress(item) },
    author: item.author,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    isPublished: item.isPublished,
    visibility: item.visibility,
    thumb: item.module!.thumb
      ? Buffer.from(item.module!.thumb as any).toString("base64")
      : null,
  }));

  return result;
}

export default getCoursesByModule;

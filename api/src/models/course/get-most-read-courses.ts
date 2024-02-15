import { Course } from "@prisma/client";
import { prisma } from "../../utils/db";
import Group from "../../utils/interfaces/db/group";

/**
 * Récupère la liste des cours les plus populaires
 * @param userIdMdb L'id de l'étudiant
 * @param max Le nombre de cours maximum à récupérer
 * @returns
 */
export default async function getMostReadCourses(
  userIdMdb: string,
  max?: number
) {
  const groupsWhereStudentIs = await Group.find({ users: userIdMdb });

  const groupIds: string[] = groupsWhereStudentIs.map((group) => group.id);

  const courses: any = await prisma.$queryRaw`
  SELECT c.id, c.title, c."moduleId", COUNT(lr.*) AS lessonReadCount
  FROM "Course" c
  JOIN "Lesson" l ON c.id = l."courseId"
  LEFT JOIN "LessonRead" lr ON l.id = lr."lessonId"
  JOIN "ModulesOnParcours" mp ON c."moduleId" = mp."moduleId"
  JOIN "Parcours" p ON mp."parcoursId" = p.id
  JOIN "GroupsOnParcours" gp ON p.id = gp."parcoursId"
  JOIN "Group" g ON gp."groupId" = g.id
  WHERE g."idMdb" = ANY(${groupIds})
  GROUP BY c.id, c.title, c."moduleId"
  ORDER BY lessonReadCount
  LIMIT ${max}`;

  // code to add module id,lesson id and to avoid the problem "do not know how to serialize a bigint"
  const coursesReformated: Course[] = await Promise.all(
    courses.map(async (course: any) => {
      const { lessonreadcount, moduleId, ...courseReformated } = course;

      const lessonId = (
        await prisma?.lesson.findFirst({
          select: { id: true },
          where: { courseId: courseReformated.id },
          orderBy: { order: "asc" },
        })
      )?.id;

      return {
        module: { id: moduleId },
        lessons: [{ id: lessonId }],
        ...courseReformated,
      };
    })
  );

  return coursesReformated;
}

import { prisma } from "../../utils/db.ts";
import Group from "../../utils/interfaces/db/group.ts";

/**
 * Récupère la liste des cours les plus populaires
 * @param userIdMdb L'id de l'étudiant
 * @param max Le nombre de cours maximum à récupérer
 * @returns
 */
export default async function getMostReadCourses(
  userIdMdb: string,
  max?: number,
) {
  const groupsWhereStudentIs = await Group.find({ users: userIdMdb });

  const groupIds: string[] = groupsWhereStudentIs.map((group) => group.id);

  if (groupIds.length === 0) return [];

  const query = prisma.raw.sql`
    SELECT c.id, c.title, m.id AS "moduleId", m.title AS "moduleTitle",
      (array_agg(l.id ORDER BY l."order"))[1] AS "lessonId"
    FROM "Course" c
    JOIN "Lesson" l ON c.id = l."courseId"
    LEFT JOIN "LessonRead" lr ON l.id = lr."lessonId"
    JOIN "Module" m ON c."moduleId" = m.id
    JOIN "Parcours" p ON m."parcoursId" = p.id
    JOIN "GroupsOnParcours" gp ON p.id = gp."parcoursId"
    JOIN "Group" g ON gp."groupId" = g.id
    WHERE g."idMdb" IN (
      SELECT jsonb_array_elements_text(${JSON.stringify(groupIds)}::jsonb)
    )
      AND c."isPublished" = true
      AND c."visibility" = true
      AND p."isPublished" = true
    GROUP BY c.id, m.id
    ORDER BY COUNT(lr.id) DESC
    LIMIT ${max ?? 4}
  `
    .returnsRow({
      id: "pg/int4@1",
      title: "pg/text@1",
      moduleId: "pg/int4@1",
      moduleTitle: "pg/text@1",
      lessonId: "pg/int4@1",
    })
    .build();

  const courses = await prisma.runtime().query(query);
  return courses.map(({ id, title, moduleId, moduleTitle, lessonId }) => ({
    id,
    title,
    module: { id: moduleId, title: moduleTitle },
    lessons: [{ id: lessonId }],
  }));
}

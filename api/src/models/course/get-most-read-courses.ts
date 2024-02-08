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
  console.log(userIdMdb);

  const groupsWhereStudentIs = await Group.find({ users: userIdMdb });

  const groupIds: string[] = groupsWhereStudentIs.map((group) => group.id);

  const courses = await prisma.$queryRaw`
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

  console.log({ courses });

  return [];
  /* return courses; */
}

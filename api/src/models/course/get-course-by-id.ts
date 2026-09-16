import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";

export default async function getCourseById(courseId: number): Promise<{
  id: number;
  title: string;
  content: string;
  courseSlug: string | null;
} | null> {
  // Récupération des données imbriquées avec Prisma
  const course = await prisma.orm.public.Course.where((row) =>
    whereFromObject(row, { id: courseId }),
  )
    .select("id", "title", "courseSlug", "description")
    .include("lessons", (related32) =>
      related32
        .include("activities", (related33) =>
          related33.orderBy((row) => row.order.asc()),
        )
        .orderBy((row) => row.order.asc()),
    )
    .first();

  if (!course) {
    return null;
  }

  // Construction "intelligente" du contenu textuel (en Markdown)
  let markdownContent = `# ${course.title}\n\n`;
  if (course.description) {
    markdownContent += `${course.description}\n\n`;
  }

  // On boucle sur chaque leçon
  for (const lesson of course.lessons) {
    markdownContent += `## Leçon : ${lesson.title}\n`;
    if (lesson.description) {
      markdownContent += `${lesson.description}\n\n`;
    }

    // On boucle sur les activités de la leçon
    if (lesson.activities.length > 0) {
      markdownContent += `### Activités abordées :\n`;
      for (const activity of lesson.activities) {
        const activityTitle = activity.title || "Activité";
        markdownContent += `- **${activityTitle}** (Format : ${activity.type})\n`;
      }
      markdownContent += `\n`;
    }
  }

  return {
    id: course.id,
    title: course.title,
    content: markdownContent,
    courseSlug: course.courseSlug,
  };
}

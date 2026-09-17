import {
  calculateCourseProgress,
  calculateModuleProgress,
} from "../../helpers/calculate-module-progress.ts";
import { enrichContactsWithNames } from "../../helpers/enrich-contacts-with-names.ts";
import { prisma } from "../../utils/db.ts";
import { isModuleCompleted } from "../../helpers/skill-achievement.ts";
import { loadSkillAchievements } from "../../helpers/skill-achievement-query.ts";

export default async function getLimitedModuleDetail(
  moduleId: number,
  userMongoId: string,
) {
  const isTeacher = await prisma.orm.public.Admin.where({
    idMdb: userMongoId,
  }).first();

  const module = await prisma.orm.public.Module.where({ id: moduleId })
    .select(
      "id",
      "title",
      "description",
      "image",
      "duration",
      "minDate",
      "maxDate",
    )
    .include("parcours", (related151) =>
      related151
        .select("title", "id")
        .include("objectives", (related152) =>
          related152.select("id", "description"),
        )
        .include("tags", (related153) => related153.include("tag")),
    )
    .include("bonusSkills", (related154) =>
      related154
        .include("bonusSkill", (related155) => related155)
        .orderBy((row) => row.bonusSkillId.asc()),
    )
    .include("contacts", (related156) =>
      related156.include("contact", (related157) =>
        related157.select("id", "idMdb"),
      ),
    )
    .include("courses", (courses) =>
      (isTeacher
        ? courses
        : courses.where({ visibility: true, isPublished: true })
      )
        .select(
          "id",
          "title",
          "description",
          "visibility",
          "isPublished",
          "courseSlug",
        )
        .include("tags", (related159) =>
          related159.include("tag", (related160) =>
            related160.select("id", "name", "color"),
          ),
        )
        .include("contacts", (related161) =>
          related161.include("contact", (related162) =>
            related162.select("idMdb"),
          ),
        )
        .include("assignment", (related163) =>
          related163
            .include("files", (related164) =>
              related164.orderBy((row) => row.id.asc()),
            )
            .include("criteria", (related165) =>
              related165.orderBy((row) => row.order.asc()),
            )
            .include("submissions", (related166) =>
              related166
                .where((row) =>
                  row.student.some((student) => student.idMdb.eq(userMongoId)),
                )
                .select(
                  "id",
                  "text",
                  "submittedAt",
                  "grade",
                  "feedback",
                  "gradedAt",
                )
                .include("files", (related167) =>
                  related167.orderBy((row) => row.id.asc()),
                )
                .include("criterionScores"),
            ),
        )
        .include("lessons", (related168) =>
          related168
            .include("tag")
            .include("lessonsRead", (related169) =>
              related169.where((row) =>
                row.student.some((student) => student.idMdb.eq(userMongoId)),
              ),
            )
            .orderBy((row) => row.order.asc()),
        )
        .orderBy((row) => row.order.asc()),
    )
    .first();

  if (!module) {
    throw { message: "Le module n'existe pas.", statusCode: 404 };
  }
  const skillAchievements = await loadSkillAchievements(userMongoId, {
    skillIds: module.bonusSkills.map(({ bonusSkillId }) => bonusSkillId),
  });
  const contacts = await enrichContactsWithNames(
    module.contacts.map(({ contact }) => contact),
  );

  return {
    id: module.id,
    title: module.title,
    description: module.description,
    image: module.image
      ? Buffer.from(module.image as any).toString("base64")
      : null,
    duration: module.duration,
    minDate: module.minDate,
    maxDate: module.maxDate,
    parcours: module.parcours!.title,
    parcoursId: module.parcours!.id,
    tags: module.parcours!.tags.map(({ tag }) => tag),
    bonusSkills: module.bonusSkills.map(({ bonusSkillId }) =>
      skillAchievements.get(bonusSkillId)!,
    ),
    contacts,
    // Progression calculée ici : `lessonsRead` est déjà chargé, aucune requête
    // supplémentaire. Le front se contente de lire `stats.progress`.
    stats: {
      progress: calculateModuleProgress(module),
      isCompleted: isModuleCompleted(module),
    },
    courses: module.courses.map(({ contacts, tags, ...course }) => ({
      ...course,
      assignment: course.assignment
        ? {
            ...course.assignment,
            criteria:
              isTeacher || course.assignment.rubricVisible
                ? course.assignment.criteria
                : [],
          }
        : null,
      aiIndexed: Boolean(course.courseSlug),
      contacts: contacts.map(({ contact }) => contact),
      tags: tags.map(({ tag }) => tag),
      stats: {
        progress: calculateCourseProgress(course),
        isCompleted: isModuleCompleted({ courses: [course] }),
      },
    })),
  };
}

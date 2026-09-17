import { prisma } from "../utils/db.ts";
import { and } from "@prisma/orm-postgres/orm-client";
import { withSkillAchievement } from "./skill-achievement.ts";

type SkillFilter = {
  skillIds?: readonly number[];
  parcoursIds?: readonly number[];
};

/** Charge la progression de tous les modules liés aux compétences demandées. */
export async function loadSkillAchievements(
  studentMdbId: string,
  { skillIds, parcoursIds }: SkillFilter,
) {
  if (skillIds?.length === 0 || parcoursIds?.length === 0) return new Map();

  const skills = await prisma.orm.public.BonusSkill.where((row) =>
    and(
      ...(skillIds ? [row.id.in([...skillIds])] : []),
      ...(parcoursIds ? [row.parcoursId.in([...parcoursIds])] : []),
    ),
  )
    .include("modules", (links) =>
      links.include("module", (module) =>
        module.select("id", "title").include("courses", (courses) =>
          courses
            .where({ visibility: true, isPublished: true })
            .include("assignment", (assignment) =>
              assignment.include("submissions", (submissions) =>
                submissions
                  .where((row) =>
                    row.student.some((student) =>
                      student.idMdb.eq(studentMdbId),
                    ),
                  )
                  .select("submittedAt"),
              ),
            )
            .include("lessons", (lessons) =>
              lessons.include("lessonsRead", (reads) =>
                reads
                  .where((row) =>
                    row.student.some((student) =>
                      student.idMdb.eq(studentMdbId),
                    ),
                  )
                  .select("finishedAt"),
              ),
            ),
        ),
      ),
    )
    .orderBy((row) => row.createdAt.asc())
    .all();

  return new Map(
    skills.map((skill) => [
      skill.id,
      withSkillAchievement({
        ...skill,
        modules: skill.modules.flatMap(({ module }) =>
          module ? [{ module }] : [],
        ),
      }),
    ]),
  );
}

import { and } from "@prisma/orm-postgres/orm-client";

import { prisma } from "../../utils/db.ts";
import Group from "../../utils/interfaces/db/group.ts";
import { LEARNING_PACES, LEARNING_PREFERENCES, FORMATION_LEVELS } from "../../config/learning-profile.ts";

export { LEARNING_PACES, LEARNING_PREFERENCES, FORMATION_LEVELS } from "../../config/learning-profile.ts";

export type LearningPace = (typeof LEARNING_PACES)[number];
export type LearningPreference = (typeof LEARNING_PREFERENCES)[number];
export type FormationLevel = (typeof FORMATION_LEVELS)[number];

export type AvailableFormation = {
  id: number;
  title: string;
  parcours: Array<{
    id: number;
    title: string;
    tags: Array<{ id: number; name: string; color: string }>;
    contentSamples: Array<{ title: string; type: "module" | "course" }>;
  }>;
};

export async function resolveAvailableFormations(
  userIdMdb: string,
): Promise<AvailableFormation[]> {
  const groups = await Group.find({ users: userIdMdb }).select("_id");
  if (groups.length === 0) return [];

  const groupIds = groups.map((group) => group.id as string);
  const parcours = await prisma.orm.public.Parcours.where((row) =>
    and(
      row.isPublished.eq(true),
      row.groups.some((links) =>
        links.group.some((group) => group.idMdb.in(groupIds)),
      ),
      row.modules.some((module) =>
        module.courses.some((course) =>
          and(
            course.isPublished.eq(true),
            course.visibility.eq(true),
            course.lessons.some((lesson) =>
              and(
                lesson.visibility.eq(true),
                lesson.activities.some((activity) => activity.id.gt(0)),
              ),
            ),
          ),
        ),
      ),
    ),
  )
    .select("id", "title", "formationId")
    .include("formation", (formation) => formation.select("id", "title"))
    .include("tags", (tags) =>
      tags.include("tag", (tag) => tag.select("id", "name", "color")),
    )
    .include("modules", (modules) =>
      modules
        .select("title")
        .include("courses", (courses) =>
          courses
            .where((course) =>
              and(
                course.isPublished.eq(true),
                course.visibility.eq(true),
                course.lessons.some((lesson) =>
                  and(
                    lesson.visibility.eq(true),
                    lesson.activities.some((activity) => activity.id.gt(0)),
                  ),
                ),
              ),
            )
            .select("title")
            .orderBy((course) => course.order.asc()),
        ),
    )
    .orderBy((row) => row.title.asc())
    .all();

  const byFormation = new Map<number, AvailableFormation>();
  for (const item of parcours) {
    const formation = item.formation!;
    const existing = byFormation.get(formation.id) ?? {
      id: formation.id,
      title: formation.title,
      parcours: [],
    };
    const contentSamples = item.modules
      .flatMap((module) => [
        { title: module.title, type: "module" as const },
        ...module.courses.map((course) => ({
          title: course.title,
          type: "course" as const,
        })),
      ])
      .filter((sample) => sample.title.trim().length > 0)
      .slice(0, 4);
    existing.parcours.push({
      id: item.id,
      title: item.title,
      tags: item.tags
        .map((link) => link.tag)
        .filter(
          (tag): tag is { id: number; name: string; color: string } =>
            Boolean(tag),
        ),
      contentSamples,
    });
    byFormation.set(formation.id, existing);
  }

  return [...byFormation.values()].sort((a, b) =>
    a.title.localeCompare(b.title, "fr"),
  );
}

export async function getLearningContext(userIdMdb: string) {
  const student = await prisma.orm.public.Student.where({ idMdb: userIdMdb })
    .select("id")
    .first();
  if (!student) {
    throw { statusCode: 404, message: "Profil étudiant introuvable." };
  }

  const [formations, profile, assessments] = await Promise.all([
    resolveAvailableFormations(userIdMdb),
    prisma.orm.public.StudentLearningProfile.where({ studentId: student.id })
      .select(
        "pace",
        "preferences",
        "onboardingStatus",
        "currentStep",
        "onboardingVersion",
        "initialCompletedAt",
        "updatedAt",
      )
      .first(),
    prisma.orm.public.StudentFormationAssessment.where({
      studentId: student.id,
    })
      .select("formationId", "level", "updatedAt")
      .all(),
  ]);

  const assessmentByFormation = new Map(
    assessments.map((assessment) => [assessment.formationId, assessment]),
  );
  const availableFormations = formations.map((formation) => ({
    ...formation,
    assessment: assessmentByFormation.get(formation.id)
      ? {
          level: assessmentByFormation.get(formation.id)!.level,
          updatedAt: assessmentByFormation.get(formation.id)!.updatedAt,
        }
      : null,
  }));
  const formationsToAssess = availableFormations.filter(
    (formation) => !formation.assessment,
  );
  const hasGlobalAnswers = Boolean(
    profile?.pace && profile.preferences.length > 0,
  );
  const initialCompleted = Boolean(profile?.initialCompletedAt);
  // L'onboarding initial porte volontairement sur un seul parcours. Les autres
  // niveaux restent disponibles dans le profil sans imposer un nouveau tunnel.
  const onboardingRequired =
    formations.length > 0 &&
    !initialCompleted &&
    (!hasGlobalAnswers || assessments.length === 0);

  return {
    hasAvailableContent: formations.length > 0,
    onboardingRequired,
    onboardingMode: onboardingRequired
      ? initialCompleted
        ? ("additional" as const)
        : ("initial" as const)
      : null,
    shouldAutoRedirect:
      onboardingRequired && profile?.onboardingStatus !== "in_progress",
    availableFormations,
    formationsToAssess,
    profile: {
      pace: profile?.pace ?? null,
      preferences: profile?.preferences ?? [],
      status: profile?.onboardingStatus ?? "not_started",
      currentStep: profile?.currentStep ?? "",
      version: profile?.onboardingVersion ?? 1,
      initialCompletedAt: profile?.initialCompletedAt ?? null,
      updatedAt: profile?.updatedAt ?? null,
    },
  };
}

export async function updateLearningProfile(
  userIdMdb: string,
  input: {
    pace?: LearningPace;
    preferences?: LearningPreference[];
    currentStep?: string;
    action?: "start" | "confirm";
  },
) {
  const student = await prisma.orm.public.Student.where({ idMdb: userIdMdb })
    .select("id")
    .first();
  if (!student) throw { statusCode: 404, message: "Profil étudiant introuvable." };

  const current = await prisma.orm.public.StudentLearningProfile.where({
    studentId: student.id,
  }).first();
  const pace = input.pace ?? current?.pace ?? null;
  const preferences = input.preferences ?? current?.preferences ?? [];

  if (input.action === "confirm") {
    const context = await getLearningContext(userIdMdb);
    const hasAssessment = context.availableFormations.some(
      (formation) => formation.assessment,
    );
    if (!pace || preferences.length === 0 || !hasAssessment) {
      throw {
        statusCode: 400,
        message: "Complétez toutes les réponses requises avant de confirmer.",
      };
    }
  }

  const now = new Date().toISOString();
  const status =
    input.action === "confirm"
      ? "completed"
      : input.action === "start"
        ? "in_progress"
        : (current?.onboardingStatus ?? "not_started");
  const initialCompletedAt =
    current?.initialCompletedAt ??
    (input.action === "confirm" ? now : null);

  await prisma.orm.public.StudentLearningProfile.where({
    studentId: student.id,
  }).upsert({
    create: {
      studentId: student.id,
      pace,
      preferences,
      onboardingStatus: status,
      currentStep: input.currentStep ?? "",
      onboardingVersion: 1,
      initialCompletedAt,
    },
    update: {
      pace,
      preferences,
      onboardingStatus: status,
      currentStep:
        input.action === "confirm" ? "" : (input.currentStep ?? current?.currentStep ?? ""),
      initialCompletedAt,
    },
    conflictOn: { studentId: student.id },
  });

  return getLearningContext(userIdMdb);
}

export async function updateFormationAssessment(
  userIdMdb: string,
  formationId: number,
  level: FormationLevel,
) {
  const [student, formations] = await Promise.all([
    prisma.orm.public.Student.where({ idMdb: userIdMdb }).select("id").first(),
    resolveAvailableFormations(userIdMdb),
  ]);
  if (!student) throw { statusCode: 404, message: "Profil étudiant introuvable." };
  if (!formations.some((formation) => formation.id === formationId)) {
    throw {
      statusCode: 403,
      message: "Cette formation n'est pas accessible.",
    };
  }

  await prisma.orm.public.StudentFormationAssessment.where((row) =>
    and(row.studentId.eq(student.id), row.formationId.eq(formationId)),
  ).upsert({
    create: { studentId: student.id, formationId, level },
    update: { level },
    conflictOn: { studentId: student.id, formationId },
  });

  return getLearningContext(userIdMdb);
}

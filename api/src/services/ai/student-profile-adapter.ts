import { and } from "@prisma/orm-postgres/orm-client";
import { prisma } from "../../utils/db.ts";
import getAllIndicators from "../../models/indicators/get-all-indicators.ts";

const PACE_LABELS: Record<string, string | null> = {
  progressive: "slow",
  standard: "normal",
  intensive: "fast",
  no_preference: null,
};

const EXPERIENCE_LABELS: Record<string, string | null> = {
  beginner: "beginner",
  intermediate: "intermediate",
  advanced: "advanced",
  unsure: null,
};

const PREFERENCE_LABELS: Record<string, string> = {
  concrete_examples: "exemples concrets",
  step_by_step: "pas-à-pas",
  summary: "synthèse",
  practical_exercises: "exercices pratiques",
  visual_aids: "supports visuels",
};

export type AiStudentProfile = {
  user_id: string;
  course_id: string | undefined;
  tempo_label: string | null;
  experience_label: string | null;
  weak_concepts: string[];
  preferences: string[];
  metrics: Record<string, number>;
};

export async function buildStudentProfile(
  userIdMdb: string,
  courseId?: number,
  courseReference?: string,
): Promise<AiStudentProfile> {
  const neutral: AiStudentProfile = {
    user_id: userIdMdb,
    course_id: courseReference ?? (courseId ? String(courseId) : undefined),
    tempo_label: null,
    experience_label: null,
    weak_concepts: [],
    preferences: [],
    metrics: {},
  };
  if (!courseId || userIdMdb === "anonymous_student") return neutral;

  const [student, course] = await Promise.all([
    prisma.orm.public.Student.where({ idMdb: userIdMdb }).select("id").first(),
    prisma.orm.public.Course.where({ id: courseId })
      .select("id")
      .include("module", (module) =>
        module.include("parcours", (parcours) => parcours.select("formationId")),
      )
      .first(),
  ]);
  const formationId = course?.module?.parcours?.formationId;
  if (!student || !formationId) return neutral;

  const [profile, assessment] = await Promise.all([
    prisma.orm.public.StudentLearningProfile.where({ studentId: student.id })
      .select("pace", "preferences", "initialCompletedAt")
      .first(),
    prisma.orm.public.StudentFormationAssessment.where((row) =>
      and(row.studentId.eq(student.id), row.formationId.eq(formationId)),
    )
      .select("level")
      .first(),
  ]);
  if (
    !profile?.initialCompletedAt ||
    !profile.pace ||
    profile.preferences.length === 0 ||
    !assessment
  ) {
    return neutral;
  }

  const indicators = await getAllIndicators(userIdMdb);
  const metrics = Object.fromEntries(
    Object.entries(indicators.indicators)
      .filter(([, indicator]) =>
        indicator.available && typeof indicator.value === "number",
      )
      .map(([key, indicator]) => [key, indicator.value as number]),
  );

  return {
    ...neutral,
    tempo_label: PACE_LABELS[profile.pace] ?? null,
    experience_label: EXPERIENCE_LABELS[assessment.level] ?? null,
    preferences: profile.preferences
      .map((preference) => PREFERENCE_LABELS[preference])
      .filter((preference): preference is string => Boolean(preference)),
    metrics,
  };
}


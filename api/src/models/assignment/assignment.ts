import type { Prisma } from "@prisma/client";
import { prisma } from "../../utils/db.ts";
import { enrichContactsWithNames } from "../../helpers/enrich-contacts-with-names.ts";
import { getExpectedAssignmentStudents } from "./teacher-assignments.ts";

export type UploadedAssignmentFile = {
  originalname: string;
  filename: string;
  mimetype: string;
  size: number;
};

export type AssignmentCriterionInput = {
  id?: number;
  label: string;
  weight: number;
};

export type AssignmentConfigInput = {
  required: boolean;
  dueAt?: string;
  maxScore?: number;
  rubricVisible?: boolean;
  instructions?: string;
  criteria?: AssignmentCriterionInput[];
  removeFileIds?: number[];
};

const assignmentWithCourseInclude = {
  files: { orderBy: { id: "asc" as const } },
  criteria: { orderBy: { order: "asc" as const } },
  course: {
    select: {
      module: {
        select: {
          parcours: {
            select: { groups: { select: { group: { select: { idMdb: true } } } } },
          },
        },
      },
    },
  },
} satisfies Prisma.CourseAssignmentInclude;

const assignmentInclude = {
  files: { orderBy: { id: "asc" as const } },
  criteria: { orderBy: { order: "asc" as const } },
} satisfies Prisma.CourseAssignmentInclude;

function httpError(statusCode: number, message: string) {
  return Object.assign(new Error(message), { statusCode });
}

function normalizedConfig(input: AssignmentConfigInput) {
  if (!input.required) return null;

  const dueAt = new Date(input.dueAt ?? "");
  const maxScore = Number(input.maxScore ?? 20);
  const instructions = input.instructions?.trim() ?? "";
  const criteria = (input.criteria ?? []).map((criterion) => ({
    label: criterion.label.trim(),
    weight: Number(criterion.weight),
  }));

  if (Number.isNaN(dueAt.getTime())) {
    throw httpError(400, "La date limite de remise est obligatoire.");
  }
  if (!Number.isFinite(maxScore) || maxScore <= 0 || maxScore > 1000) {
    throw httpError(400, "Le barème doit être compris entre 0 et 1000.");
  }
  if (!instructions) {
    throw httpError(400, "Les instructions de remise sont obligatoires.");
  }
  if (instructions.length > 50_000) {
    throw httpError(400, "Les instructions sont trop longues.");
  }
  if (criteria.length > 50 || criteria.some(({ label }) => label.length > 300)) {
    throw httpError(400, "La grille d'évaluation est trop volumineuse.");
  }
  if (
    criteria.some(
      (criterion) =>
        !criterion.label ||
        !Number.isFinite(criterion.weight) ||
        criterion.weight <= 0,
    )
  ) {
    throw httpError(400, "Chaque critère doit avoir un libellé et un poids positif.");
  }
  if (criteria.length > 0) {
    const total = criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
    if (Math.abs(total - maxScore) > 0.001) {
      throw httpError(
        400,
        "La somme des critères doit être égale au barème du devoir.",
      );
    }
  }

  return {
    dueAt,
    maxScore,
    rubricVisible: input.rubricVisible ?? true,
    instructions,
    criteria,
  };
}

export async function saveCourseAssignment(
  courseId: number,
  input: AssignmentConfigInput,
  files: readonly UploadedAssignmentFile[],
) {
  const config = normalizedConfig(input);
  const existing = await prisma.courseAssignment.findUnique({
    where: { courseId },
    include: assignmentInclude,
  });

  if (!config) {
    if (!existing) return { assignment: null, removedStoredNames: [] as string[] };
    const submissionCount = await prisma.assignmentSubmission.count({
      where: { assignmentId: existing.id },
    });
    if (submissionCount > 0) {
      throw httpError(
        409,
        "Le devoir ne peut plus être supprimé car des apprenants ont déjà commencé leur rendu.",
      );
    }
    const removedStoredNames = [
      ...existing.files.map((file) => file.storedName),
      ...(await prisma.assignmentSubmissionFile.findMany({
        where: { submission: { assignmentId: existing.id } },
        select: { storedName: true },
      })).map((file) => file.storedName),
    ];
    await prisma.courseAssignment.delete({ where: { id: existing.id } });
    return { assignment: null, removedStoredNames };
  }

  const removeFileIds = [...new Set(input.removeFileIds ?? [])];
  const filesToRemove = existing
    ? existing.files.filter((file) => removeFileIds.includes(file.id))
    : [];
  const rubricChanged = Boolean(
    existing &&
      (existing.maxScore !== config.maxScore ||
        existing.criteria.length !== config.criteria.length ||
        existing.criteria.some((criterion, index) => {
          const replacement = config.criteria[index];
          return (
            !replacement ||
            criterion.label !== replacement.label ||
            criterion.weight !== replacement.weight
          );
        })),
  );
  if (existing && rubricChanged) {
    const gradedCount = await prisma.assignmentSubmission.count({
      where: { assignmentId: existing.id, grade: { not: null } },
    });
    if (gradedCount > 0) {
      throw httpError(
        409,
        "Le barème ne peut plus être modifié car des devoirs ont déjà été notés.",
      );
    }
  }

  const assignment = await prisma.$transaction(async (transaction) => {
    const saved = existing
      ? await transaction.courseAssignment.update({
          where: { id: existing.id },
          data: {
            dueAt: config.dueAt,
            maxScore: config.maxScore,
            rubricVisible: config.rubricVisible,
            instructions: config.instructions,
          },
        })
      : await transaction.courseAssignment.create({
          data: {
            courseId,
            dueAt: config.dueAt,
            maxScore: config.maxScore,
            rubricVisible: config.rubricVisible,
            instructions: config.instructions,
          },
        });

    // Une modification de grille invalide les anciennes ventilations, mais
    // conserve la note totale déjà attribuée et son historique.
    if (!existing || rubricChanged) {
      await transaction.assignmentCriterionScore.deleteMany({
        where: { criterion: { assignmentId: saved.id } },
      });
      await transaction.courseAssignmentCriterion.deleteMany({
        where: { assignmentId: saved.id },
      });
      if (config.criteria.length > 0) {
        await transaction.courseAssignmentCriterion.createMany({
          data: config.criteria.map((criterion, order) => ({
            assignmentId: saved.id,
            label: criterion.label,
            weight: criterion.weight,
            order,
          })),
        });
      }
    }
    if (filesToRemove.length > 0) {
      await transaction.courseAssignmentFile.deleteMany({
        where: { id: { in: filesToRemove.map((file) => file.id) } },
      });
    }
    if (files.length > 0) {
      await transaction.courseAssignmentFile.createMany({
        data: files.map((file) => ({
          assignmentId: saved.id,
          originalName: file.originalname,
          storedName: file.filename,
          mimeType: file.mimetype,
          size: file.size,
        })),
      });
    }
    return transaction.courseAssignment.findUniqueOrThrow({
      where: { id: saved.id },
      include: assignmentInclude,
    });
  });

  return {
    assignment,
    removedStoredNames: filesToRemove.map((file) => file.storedName),
  };
}

export async function getCourseAssignment(
  courseId: number,
  userIdMdb: string,
  staff: boolean,
) {
  const assignment = await prisma.courseAssignment.findUnique({
    where: { courseId },
    include: {
      ...assignmentWithCourseInclude,
      submissions: {
        where: staff ? undefined : { student: { idMdb: userIdMdb } },
        orderBy: [{ submittedAt: "desc" }, { updatedAt: "desc" }],
        include: {
          student: { select: { id: true, idMdb: true } },
          files: { orderBy: { id: "asc" } },
          criterionScores: true,
        },
      },
    },
  });
  if (!assignment) return null;

  const submissions = staff
    ? await enrichContactsWithNames(
        assignment.submissions.map((submission) => submission.student),
      )
    : [];
  const studentNames = new Map(
    submissions.map((student) => [student.idMdb, student]),
  );

  const expectedStudents = staff
    ? await getExpectedAssignmentStudents(
        assignment.course.module.parcours.groups.map(({ group }) => group.idMdb),
      )
    : [];
  const { course: _course, ...assignmentData } = assignment;

  return {
    ...assignmentData,
    criteria:
      staff || assignment.rubricVisible ? assignment.criteria : [],
    submissions: assignment.submissions.map((submission) => ({
      ...submission,
      student: studentNames.get(submission.student.idMdb) ?? submission.student,
    })),
    expectedStudents,
  };
}

export function getStudentAssignments(
  userIdMdb: string,
  parcoursIds: readonly number[],
) {
  return prisma.courseAssignment.findMany({
    where: {
      course: {
        isPublished: true,
        visibility: true,
        module: { parcoursId: { in: [...parcoursIds] } },
      },
    },
    orderBy: [{ dueAt: "asc" }, { id: "asc" }],
    select: {
      id: true,
      dueAt: true,
      maxScore: true,
      course: {
        select: {
          id: true,
          title: true,
          module: {
            select: {
              id: true,
              title: true,
              parcours: { select: { id: true, title: true } },
            },
          },
        },
      },
      submissions: {
        where: { student: { idMdb: userIdMdb } },
        take: 1,
        select: {
          id: true,
          submittedAt: true,
          grade: true,
          gradedAt: true,
        },
      },
    },
  });
}

export async function saveSubmission(
  courseId: number,
  userIdMdb: string,
  text: string,
  files: readonly UploadedAssignmentFile[],
  submit: boolean,
) {
  const student = await prisma.student.findUnique({ where: { idMdb: userIdMdb } });
  if (!student) throw httpError(403, "Seul un apprenant peut rendre un devoir.");

  const assignment = await prisma.courseAssignment.findUnique({
    where: { courseId },
    include: {
      course: { select: { moduleId: true } },
      submissions: {
        where: { studentId: student.id },
        include: { files: true },
      },
    },
  });
  if (!assignment) throw httpError(404, "Ce cours ne comporte aucun devoir.");

  if (text.length > 100_000) {
    throw httpError(400, "La réponse textuelle est trop longue.");
  }

  const existing = assignment.submissions[0];
  if (existing?.submittedAt) {
    throw httpError(409, "Ce devoir a déjà été rendu.");
  }
  if (submit && !text.trim() && files.length === 0 && !existing?.files.length) {
    throw httpError(400, "Ajoutez un texte ou au moins un fichier avant de rendre le devoir.");
  }

  return prisma.$transaction(async (transaction) => {
    const submission = existing
      ? await transaction.assignmentSubmission.update({
          where: { id: existing.id },
          data: { text: text.trim() || null, submittedAt: submit ? new Date() : null },
        })
      : await transaction.assignmentSubmission.create({
          data: {
            assignmentId: assignment.id,
            studentId: student.id,
            text: text.trim() || null,
            submittedAt: submit ? new Date() : null,
          },
        });
    if (files.length > 0) {
      await transaction.assignmentSubmissionFile.createMany({
        data: files.map((file) => ({
          submissionId: submission.id,
          originalName: file.originalname,
          storedName: file.filename,
          mimeType: file.mimetype,
          size: file.size,
        })),
      });
    }
    const saved = await transaction.assignmentSubmission.findUniqueOrThrow({
      where: { id: submission.id },
      include: { files: true, criterionScores: true },
    });
    if (submit) {
      const unfinishedLessons = await transaction.lesson.count({
        where: {
          courseId,
          lessonsRead: {
            none: { studentId: student.id, finishedAt: { not: null } },
          },
        },
      });
      if (unfinishedLessons === 0) {
        await transaction.courseRead.updateMany({
          where: { courseId, studentId: student.id, finishedAt: null },
          data: { finishedAt: new Date() },
        });
      }

      const [unfinishedModuleLessons, unfinishedModuleAssignments] =
        await Promise.all([
          transaction.lesson.count({
            where: {
              course: {
                moduleId: assignment.course.moduleId,
                visibility: true,
                isPublished: true,
              },
              lessonsRead: {
                none: { studentId: student.id, finishedAt: { not: null } },
              },
            },
          }),
          transaction.courseAssignment.count({
            where: {
              course: {
                moduleId: assignment.course.moduleId,
                visibility: true,
                isPublished: true,
              },
              submissions: {
                none: { studentId: student.id, submittedAt: { not: null } },
              },
            },
          }),
        ]);
      if (unfinishedModuleLessons === 0 && unfinishedModuleAssignments === 0) {
        await transaction.moduleRead.updateMany({
          where: {
            moduleId: assignment.course.moduleId,
            studentId: student.id,
            finishedAt: null,
          },
          data: { finishedAt: new Date() },
        });
      }
    }
    return saved;
  });
}

export type AssignmentGradeInput = {
  grade?: number;
  feedback?: string;
  criterionScores?: Array<{ criterionId: number; score: number }>;
};

export async function gradeSubmission(
  courseId: number,
  submissionId: number,
  input: AssignmentGradeInput,
  graderIdMdb: string,
) {
  const submission = await prisma.assignmentSubmission.findFirst({
    where: { id: submissionId, assignment: { courseId } },
    include: { assignment: { include: { criteria: true } } },
  });
  if (!submission) throw httpError(404, "Rendu introuvable.");
  if (!submission.submittedAt) throw httpError(409, "Ce devoir n'a pas encore été rendu.");

  const criteria = submission.assignment.criteria;
  let grade: number;
  let scores: Array<{ criterionId: number; score: number }> = [];
  if (criteria.length > 0) {
    const supplied = new Map(
      (input.criterionScores ?? []).map((item) => [Number(item.criterionId), Number(item.score)]),
    );
    scores = criteria.map((criterion) => ({
      criterionId: criterion.id,
      score: supplied.get(criterion.id) ?? Number.NaN,
    }));
    if (
      scores.some((item) => {
        const criterion = criteria.find(({ id }) => id === item.criterionId)!;
        return !Number.isFinite(item.score) || item.score < 0 || item.score > criterion.weight;
      })
    ) {
      throw httpError(400, "La note de chaque critère doit respecter son poids.");
    }
    grade = scores.reduce((sum, item) => sum + item.score, 0);
  } else {
    grade = Number(input.grade);
    if (!Number.isFinite(grade) || grade < 0 || grade > submission.assignment.maxScore) {
      throw httpError(400, "La note ne respecte pas le barème du devoir.");
    }
  }

  return prisma.$transaction(async (transaction) => {
    await transaction.assignmentCriterionScore.deleteMany({ where: { submissionId } });
    if (scores.length > 0) {
      await transaction.assignmentCriterionScore.createMany({
        data: scores.map((score) => ({ submissionId, ...score })),
      });
    }
    return transaction.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        grade,
        feedback: input.feedback?.trim() || null,
        gradedAt: new Date(),
        gradedBy: graderIdMdb,
      },
      include: { files: true, criterionScores: true, student: true },
    });
  });
}

export async function getAssignmentFile(
  courseId: number,
  fileId: number,
  kind: "brief" | "submission",
  userIdMdb: string,
  staff: boolean,
) {
  if (kind === "brief") {
    return prisma.courseAssignmentFile.findFirst({
      where: { id: fileId, assignment: { courseId } },
    });
  }
  return prisma.assignmentSubmissionFile.findFirst({
    where: {
      id: fileId,
      submission: {
        assignment: { courseId },
        ...(staff ? {} : { student: { idMdb: userIdMdb } }),
      },
    },
  });
}

import {
  requireDatabaseRow,
  whereFromObject,
} from "../../utils/prisma-query.ts";
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
  if (
    criteria.length > 50 ||
    criteria.some(({ label }) => label.length > 300)
  ) {
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
    throw httpError(
      400,
      "Chaque critère doit avoir un libellé et un poids positif.",
    );
  }
  if (criteria.length > 0) {
    const total = criteria.reduce(
      (sum, criterion) => sum + criterion.weight,
      0,
    );
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
  const existing = await prisma.orm.public.CourseAssignment.where((row) =>
    whereFromObject(row, { courseId }),
  )
    .include("files", (related) => related.orderBy((row) => row.id.asc()))
    .include("criteria", (related) => related.orderBy((row) => row.order.asc()))
    .first();

  if (!config) {
    if (!existing)
      return { assignment: null, removedStoredNames: [] as string[] };
    const submissionCount = await prisma.orm.public.AssignmentSubmission.where(
      (row) => whereFromObject(row, { assignmentId: existing.id }),
    )
      .aggregate((aggregate) => ({ total: aggregate.count() }))
      .then(({ total }) => total);
    if (submissionCount > 0) {
      throw httpError(
        409,
        "Le devoir ne peut plus être supprimé car des apprenants ont déjà commencé leur rendu.",
      );
    }
    const removedStoredNames = [
      ...existing.files.map((file) => file.storedName),
      ...(
        await prisma.orm.public.AssignmentSubmissionFile.where((row) =>
          whereFromObject(row, { submission: { assignmentId: existing.id } }),
        )
          .select("storedName")
          .all()
      ).map((file) => file.storedName),
    ];
    await prisma.orm.public.CourseAssignment.where((row) =>
      whereFromObject(row, { id: existing.id }),
    )
      .delete()
      .then(requireDatabaseRow);
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
    const gradedCount = await prisma.orm.public.AssignmentSubmission.where(
      (row) =>
        whereFromObject(row, {
          assignmentId: existing.id,
          grade: { not: null },
        }),
    )
      .aggregate((aggregate) => ({ total: aggregate.count() }))
      .then(({ total }) => total);
    if (gradedCount > 0) {
      throw httpError(
        409,
        "Le barème ne peut plus être modifié car des devoirs ont déjà été notés.",
      );
    }
  }

  const assignment = await prisma.transaction(async (transaction) => {
    const saved = existing
      ? await transaction.orm.public.CourseAssignment.where((row) =>
          whereFromObject(row, { id: existing.id }),
        )
          .update({
            dueAt: config.dueAt.toISOString(),
            maxScore: config.maxScore,
            rubricVisible: config.rubricVisible,
            instructions: config.instructions,
          })
          .then(requireDatabaseRow)
      : await transaction.orm.public.CourseAssignment.create({
          courseId,
          dueAt: config.dueAt.toISOString(),
          maxScore: config.maxScore,
          rubricVisible: config.rubricVisible,
          instructions: config.instructions,
        });

    // Une modification de grille invalide les anciennes ventilations, mais
    // conserve la note totale déjà attribuée et son historique.
    if (!existing || rubricChanged) {
      await transaction.orm.public.AssignmentCriterionScore.where((row) =>
        whereFromObject(row, { criterion: { assignmentId: saved.id } }),
      )
        .deleteAndCount()
        .then((count) => ({ count }));
      await transaction.orm.public.CourseAssignmentCriterion.where((row) =>
        whereFromObject(row, { assignmentId: saved.id }),
      )
        .deleteAndCount()
        .then((count) => ({ count }));
      if (config.criteria.length > 0) {
        await transaction.orm.public.CourseAssignmentCriterion.createAndCount(
          config.criteria.map((criterion, order) => ({
            assignmentId: saved.id,
            label: criterion.label,
            weight: criterion.weight,
            order,
          })),
        ).then((count) => ({ count }));
      }
    }
    if (filesToRemove.length > 0) {
      await transaction.orm.public.CourseAssignmentFile.where((row) =>
        whereFromObject(row, {
          id: { in: filesToRemove.map((file) => file.id) },
        }),
      )
        .deleteAndCount()
        .then((count) => ({ count }));
    }
    if (files.length > 0) {
      await transaction.orm.public.CourseAssignmentFile.createAndCount(
        files.map((file) => ({
          assignmentId: saved.id,
          originalName: file.originalname,
          storedName: file.filename,
          mimeType: file.mimetype,
          size: file.size,
        })),
      ).then((count) => ({ count }));
    }
    return transaction.orm.public.CourseAssignment.where((row) =>
      whereFromObject(row, { id: saved.id }),
    )
      .include("files", (related) => related.orderBy((row) => row.id.asc()))
      .include("criteria", (related) => related.orderBy((row) => row.order.asc()))
      .first()
      .then(requireDatabaseRow);
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
  const assignment = await prisma.orm.public.CourseAssignment.where((row) =>
    whereFromObject(row, { courseId }),
  )
    .include("files", (related) => related.orderBy((row) => row.id.asc()))
    .include("criteria", (related) => related.orderBy((row) => row.order.asc()))
    .include("course", (course) =>
      course.include("module", (module) =>
        module.include("parcours", (parcours) =>
          parcours.include("groups", (groups) =>
            groups.include("group", (group) => group.select("idMdb")),
          ),
        ),
      ),
    )
    .include("submissions", (related2) =>
      related2
        .where((row) =>
          whereFromObject(
            row,
            staff ? undefined : { student: { idMdb: userIdMdb } },
          ),
        )
        .include("student", (related3) => related3.select("id", "idMdb"))
        .include("files", (related4) => related4.orderBy((row) => row.id.asc()))
        .include("criterionScores")
        .orderBy([
          (row) => row.submittedAt.desc(),
          (row) => row.updatedAt.desc(),
        ]),
    )
    .first();
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
        assignment.course!.module!.parcours!.groups.map(
          ({ group }) => group!.idMdb,
        ),
      )
    : [];
  const { course: _course, ...assignmentData } = assignment;

  return {
    ...assignmentData,
    criteria: staff || assignment.rubricVisible ? assignment.criteria : [],
    submissions: assignment.submissions.map((submission) => ({
      ...submission,
      student: studentNames.get(submission.student!.idMdb) ?? submission.student,
    })),
    expectedStudents,
  };
}

export function getStudentAssignments(
  userIdMdb: string,
  parcoursIds: readonly number[],
) {
  return prisma.orm.public.CourseAssignment.where((row) =>
    whereFromObject(row, {
      course: {
        isPublished: true,
        visibility: true,
        module: { parcoursId: { in: [...parcoursIds] } },
      },
    }),
  )
    .select("id", "dueAt", "maxScore")
    .include("course", (related5) =>
      related5
        .select("id", "title")
        .include("module", (related6) =>
          related6
            .select("id", "title")
            .include("parcours", (related7) => related7.select("id", "title")),
        ),
    )
    .include("submissions", (related8) =>
      related8
        .where((row) => whereFromObject(row, { student: { idMdb: userIdMdb } }))
        .select("id", "submittedAt", "grade", "gradedAt")
        .limit(1),
    )
    .orderBy([(row) => row.dueAt.asc(), (row) => row.id.asc()])
    .all();
}

export async function saveSubmission(
  courseId: number,
  userIdMdb: string,
  text: string,
  files: readonly UploadedAssignmentFile[],
  submit: boolean,
) {
  const student = await prisma.orm.public.Student.where((row) =>
    whereFromObject(row, { idMdb: userIdMdb }),
  ).first();
  if (!student)
    throw httpError(403, "Seul un apprenant peut rendre un devoir.");

  const assignment = await prisma.orm.public.CourseAssignment.where((row) =>
    whereFromObject(row, { courseId }),
  )
    .include("course", (related9) => related9.select("moduleId"))
    .include("submissions", (related10) =>
      related10
        .where((row) => whereFromObject(row, { studentId: student.id }))
        .include("files"),
    )
    .first();
  if (!assignment) throw httpError(404, "Ce cours ne comporte aucun devoir.");

  if (text.length > 100_000) {
    throw httpError(400, "La réponse textuelle est trop longue.");
  }

  const existing = assignment.submissions[0];
  if (existing?.submittedAt) {
    throw httpError(409, "Ce devoir a déjà été rendu.");
  }
  if (submit && !text.trim() && files.length === 0 && !existing?.files.length) {
    throw httpError(
      400,
      "Ajoutez un texte ou au moins un fichier avant de rendre le devoir.",
    );
  }

  return prisma.transaction(async (transaction) => {
    const submission = existing
      ? await transaction.orm.public.AssignmentSubmission.where((row) =>
          whereFromObject(row, { id: existing.id }),
        )
          .update({
            text: text.trim() || null,
            submittedAt: submit ? new Date().toISOString() : null,
          })
          .then(requireDatabaseRow)
      : await transaction.orm.public.AssignmentSubmission.create({
          assignmentId: assignment.id,
          studentId: student.id,
          text: text.trim() || null,
          submittedAt: submit ? new Date().toISOString() : null,
        });
    if (files.length > 0) {
      await transaction.orm.public.AssignmentSubmissionFile.createAndCount(
        files.map((file) => ({
          submissionId: submission.id,
          originalName: file.originalname,
          storedName: file.filename,
          mimeType: file.mimetype,
          size: file.size,
        })),
      ).then((count) => ({ count }));
    }
    const saved = await transaction.orm.public.AssignmentSubmission.where(
      (row) => whereFromObject(row, { id: submission.id }),
    )
      .include("files")
      .include("criterionScores")
      .first()
      .then(requireDatabaseRow);
    if (submit) {
      const unfinishedLessons = await transaction.orm.public.Lesson.where(
        (row) =>
          whereFromObject(row, {
            courseId,
            lessonsRead: {
              none: { studentId: student.id, finishedAt: { not: null } },
            },
          }),
      )
        .aggregate((aggregate) => ({ total: aggregate.count() }))
        .then(({ total }) => total);
      if (unfinishedLessons === 0) {
        await transaction.orm.public.CourseRead.where((row) =>
          whereFromObject(row, {
            courseId,
            studentId: student.id,
            finishedAt: null,
          }),
        )
          .updateAndCount({ finishedAt: new Date().toISOString() })
          .then((count) => ({ count }));
      }

      const [unfinishedModuleLessons, unfinishedModuleAssignments] =
        await Promise.all([
          transaction.orm.public.Lesson.where((row) =>
            whereFromObject(row, {
              course: {
                moduleId: assignment.course!.moduleId,
                visibility: true,
                isPublished: true,
              },
              lessonsRead: {
                none: { studentId: student.id, finishedAt: { not: null } },
              },
            }),
          )
            .aggregate((aggregate) => ({ total: aggregate.count() }))
            .then(({ total }) => total),
          transaction.orm.public.CourseAssignment.where((row) =>
            whereFromObject(row, {
              course: {
                moduleId: assignment.course!.moduleId,
                visibility: true,
                isPublished: true,
              },
              submissions: {
                none: { studentId: student.id, submittedAt: { not: null } },
              },
            }),
          )
            .aggregate((aggregate) => ({ total: aggregate.count() }))
            .then(({ total }) => total),
        ]);
      if (unfinishedModuleLessons === 0 && unfinishedModuleAssignments === 0) {
        await transaction.orm.public.ModuleRead.where((row) =>
          whereFromObject(row, {
            moduleId: assignment.course!.moduleId,
            studentId: student.id,
            finishedAt: null,
          }),
        )
          .updateAndCount({ finishedAt: new Date().toISOString() })
          .then((count) => ({ count }));
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
  const submission = await prisma.orm.public.AssignmentSubmission.where((row) =>
    whereFromObject(row, { id: submissionId, assignment: { courseId } }),
  )
    .include("assignment", (related11) => related11.include("criteria"))
    .first();
  if (!submission) throw httpError(404, "Rendu introuvable.");
  if (!submission.submittedAt)
    throw httpError(409, "Ce devoir n'a pas encore été rendu.");

  const criteria = submission.assignment!.criteria;
  let grade: number;
  let scores: Array<{ criterionId: number; score: number }> = [];
  if (criteria.length > 0) {
    const supplied = new Map(
      (input.criterionScores ?? []).map((item) => [
        Number(item.criterionId),
        Number(item.score),
      ]),
    );
    scores = criteria.map((criterion) => ({
      criterionId: criterion.id,
      score: supplied.get(criterion.id) ?? Number.NaN,
    }));
    if (
      scores.some((item) => {
        const criterion = criteria.find(({ id }) => id === item.criterionId)!;
        return (
          !Number.isFinite(item.score) ||
          item.score < 0 ||
          item.score > criterion.weight
        );
      })
    ) {
      throw httpError(
        400,
        "La note de chaque critère doit respecter son poids.",
      );
    }
    grade = scores.reduce((sum, item) => sum + item.score, 0);
  } else {
    grade = Number(input.grade);
    if (
      !Number.isFinite(grade) ||
      grade < 0 ||
      grade > submission.assignment!.maxScore
    ) {
      throw httpError(400, "La note ne respecte pas le barème du devoir.");
    }
  }

  return prisma.transaction(async (transaction) => {
    await transaction.orm.public.AssignmentCriterionScore.where((row) =>
      whereFromObject(row, { submissionId }),
    )
      .deleteAndCount()
      .then((count) => ({ count }));
    if (scores.length > 0) {
      await transaction.orm.public.AssignmentCriterionScore.createAndCount(
        scores.map((score) => ({ submissionId, ...score })),
      ).then((count) => ({ count }));
    }
    return transaction.orm.public.AssignmentSubmission.where((row) =>
      whereFromObject(row, { id: submissionId }),
    )
      .include("files")
      .include("criterionScores")
      .include("student")
      .update({
        grade,
        feedback: input.feedback?.trim() || null,
        gradedAt: new Date().toISOString(),
        gradedBy: graderIdMdb,
      })
      .then(requireDatabaseRow);
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
    return prisma.orm.public.CourseAssignmentFile.where((row) =>
      whereFromObject(row, { id: fileId, assignment: { courseId } }),
    ).first();
  }
  return prisma.orm.public.AssignmentSubmissionFile.where((row) =>
    whereFromObject(row, {
      id: fileId,
      submission: {
        assignment: { courseId },
        ...(staff ? {} : { student: { idMdb: userIdMdb } }),
      },
    }),
  ).first();
}

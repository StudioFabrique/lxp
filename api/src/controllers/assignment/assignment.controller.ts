import path from "node:path";
import type { Response } from "express";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import {
  getAssignmentFile,
  getCourseAssignment,
  getStudentAssignments,
  gradeSubmission,
  saveCourseAssignment,
  saveSubmission,
  type AssignmentConfigInput,
  type AssignmentGradeInput,
  type UploadedAssignmentFile,
} from "../../models/assignment/assignment.ts";
import { getTeacherUpcomingAssignments } from "../../models/assignment/teacher-assignments.ts";
import { getLinkPreview } from "../../models/assignment/link-preview.ts";
import { resolveAccessScope } from "../../utils/services/permissions/accessible-parcours.ts";
import {
  assignmentUploadsDirectory,
  removeAssignmentFiles,
} from "../../middleware/upload-assignment-files.ts";

function isStaff(req: CustomRequest) {
  return (req.auth?.userRoles[0]?.rank ?? 4) <= 2;
}

function uploadedFiles(req: CustomRequest): UploadedAssignmentFile[] {
  return (Array.isArray(req.files) ? req.files : []) as UploadedAssignmentFile[];
}

function parseJson<T>(value: unknown): T {
  if (typeof value !== "string") {
    throw Object.assign(new Error("Le contenu de la requête est invalide."), {
      statusCode: 400,
    });
  }
  try {
    return JSON.parse(value) as T;
  } catch {
    throw Object.assign(new Error("Le contenu de la requête est invalide."), {
      statusCode: 400,
    });
  }
}

function sendError(res: Response, error: unknown) {
  const known = error as { statusCode?: number; message?: string };
  return res.status(known.statusCode ?? 500).json({
    message: known.message ?? "Une erreur est survenue.",
  });
}

export async function httpGetCourseAssignment(
  req: CustomRequest,
  res: Response,
) {
  try {
    const assignment = await getCourseAssignment(
      Number(req.params.courseId),
      req.auth!.userId,
      isStaff(req),
    );
    if (!assignment) {
      return res.status(404).json({ message: "Ce cours ne comporte aucun devoir." });
    }
    return res.status(200).json({ assignment });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function httpGetStudentAssignments(
  req: CustomRequest,
  res: Response,
) {
  try {
    const scope = await resolveAccessScope(req.auth!);
    if (!scope || scope.kind !== "learner") {
      return res.status(403).json({
        message: "Cette liste est réservée aux apprenants.",
      });
    }
    const assignments = await getStudentAssignments(
      req.auth!.userId,
      scope.parcoursIds,
    );
    return res.status(200).json({ assignments });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function httpGetTeacherUpcomingAssignments(
  req: CustomRequest,
  res: Response,
) {
  try {
    const scope = await resolveAccessScope(req.auth!);
    if (!scope || scope.kind !== "teacher") {
      return res.status(403).json({
        message: "Cette liste est réservée aux formateurs.",
      });
    }
    const assignments = await getTeacherUpcomingAssignments(
      scope.moduleIds ?? [],
    );
    return res.status(200).json({ assignments });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function httpGetAssignmentLinkPreview(req: CustomRequest, res: Response) {
  const url = req.query.url;
  if (typeof url !== "string") return res.status(400).json({ message: "Lien invalide." });
  try {
    return res.status(200).json(await getLinkPreview(url));
  } catch {
    return res.status(422).json({ message: "Aperçu indisponible." });
  }
}

export async function httpPutCourseAssignment(
  req: CustomRequest,
  res: Response,
) {
  const files = uploadedFiles(req);
  try {
    const payload = parseJson<AssignmentConfigInput>(req.body.payload);
    const result = await saveCourseAssignment(
      Number(req.params.courseId),
      payload,
      files,
    );
    await removeAssignmentFiles(result.removedStoredNames);
    return res.status(200).json({ assignment: result.assignment });
  } catch (error) {
    await removeAssignmentFiles(files.map((file) => file.filename));
    return sendError(res, error);
  }
}

async function saveStudentSubmission(
  req: CustomRequest,
  res: Response,
  submit: boolean,
) {
  const files = uploadedFiles(req);
  try {
    const submission = await saveSubmission(
      Number(req.params.courseId),
      req.auth!.userId,
      typeof req.body.text === "string" ? req.body.text : "",
      files,
      submit,
    );
    return res.status(submit ? 201 : 200).json({ submission });
  } catch (error) {
    await removeAssignmentFiles(files.map((file) => file.filename));
    return sendError(res, error);
  }
}

export const httpSaveAssignmentDraft = (req: CustomRequest, res: Response) =>
  saveStudentSubmission(req, res, false);

export const httpSubmitAssignment = (req: CustomRequest, res: Response) =>
  saveStudentSubmission(req, res, true);

export async function httpGradeAssignmentSubmission(
  req: CustomRequest,
  res: Response,
) {
  try {
    const submission = await gradeSubmission(
      Number(req.params.courseId),
      Number(req.params.submissionId),
      req.body as AssignmentGradeInput,
      req.auth!.userId,
    );
    return res.status(200).json({ submission });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function httpDownloadAssignmentFile(
  req: CustomRequest,
  res: Response,
) {
  try {
    const kind = req.params.kind;
    if (kind !== "brief" && kind !== "submission") {
      return res.status(400).json({ message: "Type de fichier invalide." });
    }
    const file = await getAssignmentFile(
      Number(req.params.courseId),
      Number(req.params.fileId),
      kind,
      req.auth!.userId,
      isStaff(req),
    );
    if (!file) return res.status(404).json({ message: "Fichier introuvable." });

    return res.download(
      path.join(assignmentUploadsDirectory, path.basename(file.storedName)),
      file.originalName,
    );
  } catch (error) {
    return sendError(res, error);
  }
}

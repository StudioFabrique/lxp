import { Router } from "express";
import { param } from "express-validator";
import checkPermissions from "../../../middleware/check-permissions.ts";
import checkContentAccess from "../../../middleware/check-content-access.ts";
import { checkValidatorResult } from "../../../middleware/validators.ts";
import { uploadAssignmentFiles } from "../../../middleware/upload-assignment-files.ts";
import {
  httpDownloadAssignmentFile,
  httpGetCourseAssignment,
  httpGetStudentAssignments,
  httpGradeAssignmentSubmission,
  httpPutCourseAssignment,
  httpSaveAssignmentDraft,
  httpSubmitAssignment,
} from "../../../controllers/assignment/assignment.controller.ts";

const assignmentRouter = Router();
const courseIdValidator = [
  param("courseId").isInt({ min: 1 }).withMessage("Cours invalide."),
  checkValidatorResult,
];
const submissionIdValidator = [
  param("submissionId").isInt({ min: 1 }).withMessage("Rendu invalide."),
  checkValidatorResult,
];

assignmentRouter.get(
  "/student",
  checkPermissions("cursus", "read"),
  httpGetStudentAssignments,
);

assignmentRouter.get(
  "/course/:courseId",
  checkPermissions("course", "read"),
  courseIdValidator,
  checkContentAccess("course", "courseId"),
  httpGetCourseAssignment,
);

assignmentRouter.put(
  "/course/:courseId",
  checkPermissions("course", "update"),
  courseIdValidator,
  checkContentAccess("course", "courseId"),
  uploadAssignmentFiles(),
  httpPutCourseAssignment,
);

assignmentRouter.post(
  "/course/:courseId/submission/draft",
  checkPermissions("cursus", "write"),
  courseIdValidator,
  checkContentAccess("course", "courseId"),
  uploadAssignmentFiles(),
  httpSaveAssignmentDraft,
);

assignmentRouter.post(
  "/course/:courseId/submission/submit",
  checkPermissions("cursus", "write"),
  courseIdValidator,
  checkContentAccess("course", "courseId"),
  uploadAssignmentFiles(),
  httpSubmitAssignment,
);

assignmentRouter.put(
  "/course/:courseId/submission/:submissionId/grade",
  checkPermissions("course", "update"),
  courseIdValidator,
  submissionIdValidator,
  checkContentAccess("course", "courseId"),
  httpGradeAssignmentSubmission,
);

assignmentRouter.get(
  "/course/:courseId/file/:kind/:fileId",
  checkPermissions("course", "read"),
  courseIdValidator,
  param("fileId").isInt({ min: 1 }).withMessage("Fichier invalide."),
  param("kind").isIn(["brief", "submission"]),
  checkValidatorResult,
  checkContentAccess("course", "courseId"),
  httpDownloadAssignmentFile,
);

export default assignmentRouter;

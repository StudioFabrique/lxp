import express from "express";
import checkToken from "../../../middleware/check-token";
import httpPutLesson from "../../../controllers/lesson/http-put-lesson";
import {
  getLessonsByTagValidator,
  putLessonValidator,
} from "./lesson-validator";
import httpGetLessonsByTag from "../../../controllers/lesson/http-get-lessons-by-tag";
import checkPermissions from "../../../middleware/check-permissions";
import httpGetLessonsList from "../../../controllers/lesson/http-get-lessons-list";
import httpGetLessonDetail from "../../../controllers/lesson/http-get-losson-detail";
import httpDeleteLesson from "../../../controllers/lesson/http-delete-lesson";

const lessonRouter = express.Router();

// met à jour une lesson
lessonRouter.put("/update", checkToken, putLessonValidator, httpPutLesson);

// retourne la liste des leçons associées à un tag précis
lessonRouter.get(
  "/tag/:tagId",
  checkPermissions("lesson"),
  getLessonsByTagValidator,
  httpGetLessonsByTag
);

// retourne la liste de toutes les leçons
lessonRouter.get("/", checkPermissions("lesson"), httpGetLessonsList);

// retourne une leçon en particulier identifiée par son ID
lessonRouter.get("/:lessonId", checkPermissions("lesson"), httpGetLessonDetail);

// supprime définitivement une leçon
lessonRouter.delete("/:lessonId", checkPermissions("lesson"), httpDeleteLesson);

export default lessonRouter;
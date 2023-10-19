import express from "express";
import checkToken from "../../../middleware/check-token";
import httpPutLesson from "../../../controllers/lesson/http-put-lesson";
import {
  getLessonsByTagValidator,
  putLessonValidator,
} from "./lesson-validator";
import httpGetLessonsByTag from "../../../controllers/lesson/http-get-lessons-by-tag";

const lessonRouter = express.Router();

// met à jour une lesson
lessonRouter.put("/update", checkToken, putLessonValidator, httpPutLesson);

// retourne la liste des leçons associées à un tag précis
lessonRouter.get(
  "/tag/:tagId",
  checkToken,
  getLessonsByTagValidator,
  httpGetLessonsByTag
);

export default lessonRouter;

import express from "express";
import checkToken from "../../../middleware/check-token";
import httpPutLesson from "../../../controllers/lesson/http-put-lesson";
import { putLessonValidator } from "./lesson-validator";

const lessonRouter = express.Router();

// met à jour une lesson
lessonRouter.put("/update", checkToken, putLessonValidator, httpPutLesson);

export default lessonRouter;

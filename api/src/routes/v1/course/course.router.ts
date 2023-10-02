import express from "express";
import checkToken from "../../../middleware/check-token";

import httpPostCourse from "../../../controllers/course/http-post-course";
import {
  getCourseInformationsValidator,
  postCourseValidator,
} from "./course-validators";
import httpGetCourses from "../../../controllers/course/http-get-courses";
import httpGetCourseInformations from "../../../controllers/course/http-get-course-informations";

const courseRouter = express.Router();

// enregistre un nouveau cours en relation avec un module existant
courseRouter.post("/", checkToken, postCourseValidator, httpPostCourse);
// retourne la liste de tous les cours
courseRouter.get("/", checkToken, httpGetCourses);
// retourne les informations d'un cours identifié par son ID
courseRouter.get(
  "/infos/:courseId",
  checkToken,
  getCourseInformationsValidator,
  httpGetCourseInformations
);

export default courseRouter;

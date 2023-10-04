import express from "express";
import checkToken from "../../../middleware/check-token";

import httpPostCourse from "../../../controllers/course/http-post-course";
import {
  getCourseInformationsValidator,
  postCourseValidator,
} from "./course-validators";
import httpGetCourses from "../../../controllers/course/http-get-courses";
import httpGetCourseInformations from "../../../controllers/course/http-get-course-informations";
import multer from "multer";
import path from "path";
import httpPutCourseImage from "../../../controllers/course/http-put-course-image";
import checkPermissions from "../../../middleware/check-permissions";

const courseRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "..", "..", "..", "uploads"));
  },
  filename: function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      const newFileName =
        Date.now() + "-" + Math.round(Math.random() * 1e9) + file.originalname;
      cb(null, file.fieldname + "-" + newFileName);
    } else {
      return;
    }
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 } });

// enregistre un nouveau cours en relation avec un module existant
courseRouter.post(
  "/",
  checkPermissions("course"),
  // checkToken,
  postCourseValidator,
  httpPostCourse
);
// retourne la liste de tous les cours
courseRouter.get(
  "/",
  checkPermissions("course"),
  // checkToken,
  httpGetCourses
);
// retourne les informations d'un cours identifié par son ID
courseRouter.get(
  "/infos/:courseId",
  checkPermissions("course"),
  // checkToken,
  getCourseInformationsValidator,
  httpGetCourseInformations
);

// met à jour l'image d'en-tête d'un cours
courseRouter.put(
  "/image",
  checkPermissions("course"),
  // checkToken,
  upload.single("image"),
  httpPutCourseImage
);

export default courseRouter;

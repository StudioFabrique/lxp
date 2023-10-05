import express from "express";
import checkToken from "../../../middleware/check-token";

import httpPostCourse from "../../../controllers/course/http-post-course";
import {
  courseIdValidator,
  postCourseValidator,
  putCourseInformationsValidator,
  putCourseVisibilityValidator,
} from "./course-validators";
import httpGetCourses from "../../../controllers/course/http-get-courses";
import httpGetCourseInformations from "../../../controllers/course/http-get-course-informations";
import multer from "multer";
import path from "path";
import httpPutCourseImage from "../../../controllers/course/http-put-course-image";
import httpPutCourseInformations from "../../../controllers/course/http-put-course-informations";
import httpPutCourseTags from "../../../controllers/course/http-put-course-tags";
import {
  idsArrayValidator,
  virtualClassValidator,
} from "../../../helpers/custom-validators";
import httpPutCourseContacts from "../../../controllers/course/http-put-course-contacts";
import checkPermissions from "../../../middleware/check-permissions";
import httpPutCourseVirtualClass from "../../../controllers/course/http-put-course-virtual-class";
import httpPutCourseVisibility from "../../../controllers/course/http-put-course-visibility";

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
  courseIdValidator,
  checkPermissions("course"),
  courseIdValidator,
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

// mise à jour des informations du cours
courseRouter.put(
  "/infos",
  checkToken,
  putCourseInformationsValidator,
  httpPutCourseInformations
);

// met à jour la liste des tags associés à un cours
courseRouter.put(
  "/tags/:courseId",
  checkToken,
  idsArrayValidator,
  courseIdValidator,
  httpPutCourseTags
);

// mise à jour de la liste des contacts
courseRouter.put(
  "/contacts/:courseId",
  checkToken,
  idsArrayValidator,
  courseIdValidator,
  httpPutCourseContacts
);

// mise à jour du lien vers la classe virtuelle du cours
courseRouter.put(
  "/virtual-class/:courseId",
  checkToken,
  courseIdValidator,
  virtualClassValidator,
  httpPutCourseVirtualClass
);

// mise à jour de la visibilité du cours
courseRouter.put(
  "/visibility/:courseId",
  checkToken,
  courseIdValidator,
  putCourseVisibilityValidator,
  httpPutCourseVisibility
);

export default courseRouter;

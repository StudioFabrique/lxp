import express from "express";

import multer from "multer";
import path from "path";
import { httpDeleteCourseFromModule } from "../../../controllers/course/http-delete-course-from-module";
import httpDeleteCourseDates from "../../../controllers/course/http-delete-courseDates";
import httpGetCourseDates from "../../../controllers/course/http-get-course-dates";
import httpGetCourseInformations from "../../../controllers/course/http-get-course-informations";
import httpGetCourseObjectives from "../../../controllers/course/http-get-course-objectives";
import httpGetCourseScenario from "../../../controllers/course/http-get-course-scenario";
import httpGetCourseSkills from "../../../controllers/course/http-get-course-skills";
import httpGetCourses from "../../../controllers/course/http-get-courses";
import httpGetCoursesByModule from "../../../controllers/course/http-get-courses-by-module";
import httpGetMostReadCourses from "../../../controllers/course/http-get-most-read-courses";
import httpPostCourse from "../../../controllers/course/http-post-course";
import httpPutCourseBonusSkills from "../../../controllers/course/http-put-course-bonus-skills";
import httpPutCourseContacts from "../../../controllers/course/http-put-course-contacts";
import httpPutCourseDates from "../../../controllers/course/http-put-course-dates";
import httpPutCourseImage from "../../../controllers/course/http-put-course-image";
import httpPutCourseInformations from "../../../controllers/course/http-put-course-informations";
import httpPutCourseIsPublished from "../../../controllers/course/http-put-course-ispublished";
import httpPutCourseLesson from "../../../controllers/course/http-put-course-lesson";
import httpPutCourseNewObjective from "../../../controllers/course/http-put-course-new-objective";
import httpPutCourseObjectives from "../../../controllers/course/http-put-course-objectives";
import httpPutCourseTags from "../../../controllers/course/http-put-course-tags";
import httpPutCourseVirtualClass from "../../../controllers/course/http-put-course-virtual-class";
import httpPutManyLessons from "../../../controllers/course/http-put-many-lessons";
import httpPutReorderCourses from "../../../controllers/course/http-put-reorder-coursers";
import {
  idsArrayValidator,
  virtualClassValidator,
} from "../../../helpers/custom-validators";
import checkPermissions from "../../../middleware/check-permissions";
import {
  courseIdValidator,
  deleteCourseDatesValidator,
  postCourseValidator,
  putCourseDatesValidator,
  putCourseInformationsValidator,
  putCourseLessonValidator,
  putCourseNewObjectiveValidator,
  putReorderCoursesValidator,
} from "./course-validators";

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
  postCourseValidator,
  httpPostCourse,
);

// retourne la liste de tous les cours
courseRouter.get("/", httpGetCourses);

courseRouter.get("/most-read", httpGetMostReadCourses);

//retourne la liste des cours associés à un module
courseRouter.get("/:moduleId", httpGetCoursesByModule);

// retourne les informations d'un cours identifié par son ID
courseRouter.get(
  "/infos/:courseId",
  courseIdValidator,
  httpGetCourseInformations,
);

// met à jour l'image d'en-tête d'un cours
courseRouter.put(
  "/image",
  // checkPermissions("course"),
  upload.single("image"),
  httpPutCourseImage,
);

// mise à jour des informations du cours
courseRouter.put(
  "/infos",
  checkPermissions("course"),
  putCourseInformationsValidator,
  httpPutCourseInformations,
);

// met à jour la liste des tags associés à un cours
courseRouter.put(
  "/tags/:courseId",
  checkPermissions("course"),
  idsArrayValidator,
  courseIdValidator,
  httpPutCourseTags,
);

// mise à jour de la liste des contacts
courseRouter.put(
  "/contacts/:courseId",
  checkPermissions("course"),
  idsArrayValidator,
  courseIdValidator,
  httpPutCourseContacts,
);

// mise à jour du lien vers la classe virtuelle du cours
courseRouter.put(
  "/virtual-class/:courseId",
  checkPermissions("course"),
  courseIdValidator,
  virtualClassValidator,
  httpPutCourseVirtualClass,
);

// retourne la liste des objectifs liés à un cours
courseRouter.get(
  "/objectives/:courseId",
  checkPermissions("course"),
  courseIdValidator,
  httpGetCourseObjectives,
);

// met les objectifs du cours à jour dans la bdd
courseRouter.put(
  "/objectives/:courseId",
  checkPermissions("course"),
  courseIdValidator,
  idsArrayValidator,
  httpPutCourseObjectives,
);

// enregistre un nouvel objectif et l'associe à un parcours puis à un cours
courseRouter.put(
  "/new-objective/:courseId",
  checkPermissions("course"),
  courseIdValidator,
  putCourseNewObjectiveValidator,
  httpPutCourseNewObjective,
);

// retourne la liste des compétences associés à un cours et au module auquel le cours est rattaché
courseRouter.get(
  "/bonus-skills/:courseId",
  checkPermissions("course"),
  courseIdValidator,
  httpGetCourseSkills,
);

// met la liste des compétences du cours à jour dans la bdd
courseRouter.put(
  "/bonus-skills/:courseId",
  checkPermissions("course"),
  courseIdValidator,
  idsArrayValidator,
  httpPutCourseBonusSkills,
);

// enregistre une nouvelle leçon et l'associe à un cours
courseRouter.put(
  "/new-lesson/:courseId",
  checkPermissions("course"),
  courseIdValidator,
  putCourseLessonValidator,
  httpPutCourseLesson,
);

// retourne le scénario et les lessons d'un cours
courseRouter.get(
  "/scenario/:courseId",
  checkPermissions("course"),
  courseIdValidator,
  httpGetCourseScenario,
);

// dissocie une lesson d'un cours, si la lesson n'est associée qu'à un seul cours elle est définitivement supprimée
/* courseRouter.delete(
  "/delete-lesson/:courseId/:lessonId",
  checkPermissions("course"),
  courseIdValidator,
  deleteCourseLessonValidator,
  httpDeleteCourseLesson
); */

// associe une liste de leçons existante à un cours
courseRouter.put(
  "/lessons/:courseId",
  checkPermissions("course"),
  courseIdValidator,
  idsArrayValidator,
  httpPutManyLessons,
);

// ajoute une plage de dates au cours
courseRouter.put(
  "/dates/:courseId",
  checkPermissions("course"),
  courseIdValidator,
  putCourseDatesValidator,
  httpPutCourseDates,
);

// detache un cours d'un module, le cours devient orphelin
courseRouter.delete(
  "/detach-course/:courseId",
  checkPermissions("course"),
  courseIdValidator,
  httpDeleteCourseFromModule,
);

// efface une plage de dates du cours
courseRouter.delete(
  "/dates/:courseId/:datesId",
  checkPermissions("course"),
  courseIdValidator,
  deleteCourseDatesValidator,
  httpDeleteCourseDates,
);

// met à jour le statut publié / brouillon du cours
courseRouter.put(
  "/publish/:courseId",
  courseIdValidator,
  httpPutCourseIsPublished,
);

// retourne la liste des plages de dates associées à un cours
courseRouter.get(
  "/dates/:courseId",
  checkPermissions("role"),
  courseIdValidator,
  httpGetCourseDates,
);

// met à jour l'ordre des cours associés à un module
courseRouter.put(
  "/reorder/:moduleId",
  checkPermissions("course"),
  putReorderCoursesValidator,
  httpPutReorderCourses,
);

export default courseRouter;

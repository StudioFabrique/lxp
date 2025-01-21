/**
 * Fichier de configuration des routes pour la gestion des cours
 * Ce router gère toutes les opérations CRUD liées aux cours
 */

import express from "express";
import checkToken from "../../../middleware/check-token";

// Import des contrôleurs pour la gestion des cours
import httpPostCourse from "../../../controllers/course/http-post-course";
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
import httpGetCourseObjectives from "../../../controllers/course/http-get-course-objectives";
import httpPutCourseObjectives from "../../../controllers/course/http-put-course-objectives";
import httpPutCourseNewObjective from "../../../controllers/course/http-put-course-new-objective";
import httpGetCourseSkills from "../../../controllers/course/http-get-course-skills";
import httpPutCourseBonusSkills from "../../../controllers/course/http-put-course-bonus-skills";
import httpPutCourseLesson from "../../../controllers/course/http-put-course-lesson";
import httpGetCourseScenario from "../../../controllers/course/http-get-course-scenario";
import httpPutManyLessons from "../../../controllers/course/http-put-many-lessons";
import httpPutCourseDates from "../../../controllers/course/http-put-course-dates";
import httpDeleteCourseDates from "../../../controllers/course/http-delete-courseDates";
import httpPutCourseIsPublished from "../../../controllers/course/http-put-course-ispublished";
import httpGetCourseDates from "../../../controllers/course/http-get-course-dates";
import httpGetCoursesByModule from "../../../controllers/course/http-get-courses-by-module";
import httpPutReorderCourses from "../../../controllers/course/http-put-reorder-coursers";
import httpGetMostReadCourses from "../../../controllers/course/http-get-most-read-courses";
import { httpDeleteCourse } from "../../../controllers/course/http-delete-course";
import httpGetCoursesTimeline from "../../../controllers/course/http-get-courses-timeline";
import httpGetCoursesFromModule from "../../../controllers/course/http-get-courses-from-module";
import { moduleIdValidator } from "../modules/module-validators";
import { query } from "express-validator";
import { checkValidatorResult } from "../../../middleware/validators";

const courseRouter = express.Router();

/**
 * Configuration du stockage des fichiers uploadés avec multer
 * Les images sont stockées dans le dossier uploads
 */
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

// Configuration de multer avec une limite de taille de fichier de 1MB
const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 } });

// Routes pour la gestion des cours

/**
 * Route DELETE pour supprimer un cours d'un module
 * Nécessite les permissions "course" et une validation de l'ID du cours
 */
courseRouter.delete(
  "/delete-course/:courseId",
  checkPermissions("course"),
  courseIdValidator,
  httpDeleteCourse,
);

/**
 * Route POST pour créer un nouveau cours
 * Nécessite une validation des données du cours
 */
courseRouter.post("/", postCourseValidator, httpPostCourse);

/**
 * Route GET pour récupérer tous les cours
 * Nécessite les permissions "course"
 */
courseRouter.get("/", checkPermissions("course"), httpGetCourses);

/**
 * Route GET pour récupérer la timeline des cours
 * TODO: Ajouter des validateurs
 */
courseRouter.get(
  "/timeline",
  checkPermissions("course"),
  [
    query("minDate")
      .exists()
      .withMessage("minDate est requis")
      .custom((value) => {
        try {
          if (!(value instanceof Date) && !isNaN(new Date(value).getTime())) {
            return true;
          }
          return false;
        } catch (e) {
          return false;
        }
      })
      .withMessage("minDate doit être une date de format ISO 8601"),

    query("maxDate")
      .exists()
      .withMessage("maxDate est requis")
      .custom((value) => {
        try {
          if (!(value instanceof Date) && !isNaN(new Date(value).getTime())) {
            return true;
          }
          return false;
        } catch (e) {
          return false;
        }
      })
      .withMessage("maxDate doit être une date de format ISO 8601")
      .custom((maxDate, { req }) => {
        const minDate = req.query?.minDate;
        if (new Date(maxDate) <= new Date(minDate)) {
          throw new Error("maxDate doit être plus grand que minDate");
        }
        return true;
      }),

    query("showAllCourses")
      .optional()
      .isBoolean()
      .withMessage("showAllCourses doit être un booléen"),

    checkValidatorResult,
  ],
  httpGetCoursesTimeline,
);

/**
 * Route GET pour récupérer les cours les plus lus
 * Nécessite les permissions "course"
 */
courseRouter.get(
  "/most-read",
  checkPermissions("course"),
  httpGetMostReadCourses,
);

/**
 * Route GET pour récupérer les cours d'un module spécifique
 * Nécessite les permissions "course"
 */
courseRouter.get(
  "/:moduleId",
  checkPermissions("course"),
  httpGetCoursesByModule,
);

/**
 * Route GET pour récupérer les informations d'un cours spécifique
 * Nécessite les permissions "course" et une validation de l'ID du cours
 */
courseRouter.get(
  "/infos/:courseId",
  checkPermissions("course"),
  courseIdValidator,
  httpGetCourseInformations,
);

/**
 * Route GET pour récupérer la liste des cours d'un module
 * Nécessite les permissions "course" et une validation de l'ID du module
 */
courseRouter.get(
  "/select/:moduleId",
  checkPermissions("course"),
  moduleIdValidator,
  httpGetCoursesFromModule,
);

/**
 * Route PUT pour mettre à jour l'image d'un cours
 * Nécessite les permissions "course" et gère l'upload de fichier
 */
courseRouter.put(
  "/image",
  checkPermissions("course"),
  upload.single("image"),
  httpPutCourseImage,
);

/**
 * Route PUT pour mettre à jour les informations d'un cours
 * Nécessite les permissions "course" et une validation des données
 */
courseRouter.put(
  "/infos",
  checkPermissions("course"),
  putCourseInformationsValidator,
  httpPutCourseInformations,
);

/**
 * Route PUT pour mettre à jour les tags d'un cours
 * Nécessite les permissions "course" et des validations
 */
courseRouter.put(
  "/tags/:courseId",
  checkPermissions("course"),
  idsArrayValidator,
  courseIdValidator,
  httpPutCourseTags,
);

/**
 * Route PUT pour mettre à jour les contacts d'un cours
 * Nécessite les permissions "course" et des validations
 */
courseRouter.put(
  "/contacts/:courseId",
  checkPermissions("course"),
  idsArrayValidator,
  courseIdValidator,
  httpPutCourseContacts,
);

/**
 * Route PUT pour mettre à jour le lien de classe virtuelle
 * Nécessite les permissions "course" et des validations
 */
courseRouter.put(
  "/virtual-class/:courseId",
  checkPermissions("course"),
  courseIdValidator,
  virtualClassValidator,
  httpPutCourseVirtualClass,
);

/**
 * Route GET pour récupérer les objectifs d'un cours
 * Nécessite les permissions "course" et une validation de l'ID
 */
courseRouter.get(
  "/objectives/:courseId",
  checkPermissions("course"),
  courseIdValidator,
  httpGetCourseObjectives,
);

/**
 * Route PUT pour mettre à jour les objectifs d'un cours
 * Nécessite les permissions "course" et des validations
 */
courseRouter.put(
  "/objectives/:courseId",
  checkPermissions("course"),
  courseIdValidator,
  idsArrayValidator,
  httpPutCourseObjectives,
);

/**
 * Route PUT pour ajouter un nouvel objectif à un cours
 * Nécessite les permissions "course" et des validations
 */
courseRouter.put(
  "/new-objective/:courseId",
  checkPermissions("course"),
  courseIdValidator,
  putCourseNewObjectiveValidator,
  httpPutCourseNewObjective,
);

/**
 * Route GET pour récupérer les compétences d'un cours
 * Nécessite les permissions "course" et une validation de l'ID
 */
courseRouter.get(
  "/skills/:courseId",
  checkPermissions("course"),
  courseIdValidator,
  httpGetCourseSkills,
);

// retourne la liste des compétences associés à un cours et au module auquel le cours est rattaché
courseRouter.get(
  "/bonus-skills/:courseId",
  checkToken,
  courseIdValidator,
  httpGetCourseSkills,
);

/**
 * Route PUT pour mettre à jour les compétences bonus d'un cours
 * Nécessite les permissions "course" et des validations
 */
courseRouter.put(
  "/bonus-skills/:courseId",
  checkPermissions("course"),
  courseIdValidator,
  idsArrayValidator,
  httpPutCourseBonusSkills,
);

/**
 * Route PUT pour ajouter une nouvelle leçon à un cours
 * Nécessite les permissions "course" et des validations
 */
courseRouter.put(
  "/new-lesson/:courseId",
  checkPermissions("course"),
  courseIdValidator,
  putCourseLessonValidator,
  httpPutCourseLesson,
);

/**
 * Route GET pour récupérer le scénario et les leçons d'un cours
 * Nécessite les permissions "course" et une validation de l'ID
 */
courseRouter.get(
  "/scenario/:courseId",
  checkPermissions("course"),
  courseIdValidator,
  httpGetCourseScenario,
);

// Route commentée pour la suppression d'une leçon
/* courseRouter.delete(
  "/delete-lesson/:courseId/:lessonId",
  checkToken,
  courseIdValidator,
  deleteCourseLessonValidator,
  httpDeleteCourseLesson
); */

/**
 * Route PUT pour associer plusieurs leçons à un cours
 * Nécessite les permissions "course" et des validations
 */
courseRouter.put(
  "/lessons/:courseId",
  checkPermissions("course"),
  courseIdValidator,
  idsArrayValidator,
  httpPutManyLessons,
);

/**
 * Route PUT pour ajouter des dates à un cours
 * Nécessite les permissions "course" et des validations
 */
courseRouter.put(
  "/dates/:courseId",
  checkPermissions("course"),
  courseIdValidator,
  putCourseDatesValidator,
  httpPutCourseDates,
);

// efface une plage de dates du cours
courseRouter.delete(
  "/dates/:courseId/:datesId",
  checkToken,
  courseIdValidator,
  deleteCourseDatesValidator,
  httpDeleteCourseDates,
);

// met à jour le statut publié / brouillon du cours
courseRouter.put(
  "/publish/:courseId",
  courseIdValidator,
  checkPermissions("course"),
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

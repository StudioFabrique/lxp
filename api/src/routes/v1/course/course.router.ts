/**
 * Fichier de configuration des routes pour la gestion des cours
 * Ce router gère toutes les opérations CRUD liées aux cours
 */

import express from "express";

// Import des contrôleurs pour la gestion des cours
import httpPostCourse from "../../../controllers/course/http-post-course.ts";
import httpPostImportCourseStructure from "../../../controllers/course/http-post-import-course-structure.ts";

import {
  courseIdAndVisibilityValidator,
  courseIdValidator,
  courseTagsValidator,
  deleteCourseDatesValidator,
  postCourseValidator,
  postImportCourseStructureValidator,
  putCourseDatesValidator,
  putCourseInformationsValidator,
  putCourseLessonValidator,
  putCourseNewObjectiveValidator,
  putReorderCoursesValidator,
} from "./course-validators.ts";
import httpGetCourses from "../../../controllers/course/http-get-courses.ts";
import httpGetCourseInformations from "../../../controllers/course/http-get-course-informations.ts";
import multer from "multer";
import path from "path";
import httpPutCourseImage from "../../../controllers/course/http-put-course-image.ts";
import httpPutCourseInformations from "../../../controllers/course/http-put-course-informations.ts";
import httpPutCourseTags from "../../../controllers/course/http-put-course-tags.ts";
import {
  idsArrayValidator,
  virtualClassValidator,
} from "../../../helpers/custom-validators.ts";
import httpPutCourseContacts from "../../../controllers/course/http-put-course-contacts.ts";
import checkPermissions from "../../../middleware/check-permissions.ts";
import checkContentAccess from "../../../middleware/check-content-access.ts";
import httpPutCourseVirtualClass from "../../../controllers/course/http-put-course-virtual-class.ts";
import httpGetCourseObjectives from "../../../controllers/course/http-get-course-objectives.ts";
import httpPutCourseObjectives from "../../../controllers/course/http-put-course-objectives.ts";
import httpPutCourseNewObjective from "../../../controllers/course/http-put-course-new-objective.ts";
import httpGetCourseSkills from "../../../controllers/course/http-get-course-skills.ts";
import httpPutCourseBonusSkills from "../../../controllers/course/http-put-course-bonus-skills.ts";
import httpPutCourseLesson from "../../../controllers/course/http-put-course-lesson.ts";
import httpGetCourseScenario from "../../../controllers/course/http-get-course-scenario.ts";
import httpPutManyLessons from "../../../controllers/course/http-put-many-lessons.ts";
import httpPutCourseDates from "../../../controllers/course/http-put-course-dates.ts";
import httpDeleteCourseDates from "../../../controllers/course/http-delete-courseDates.ts";
import httpPutCourseIsPublished from "../../../controllers/course/http-put-course-ispublished.ts";
import httpGetCourseDates from "../../../controllers/course/http-get-course-dates.ts";
import httpGetCoursesByModule from "../../../controllers/course/http-get-courses-by-module.ts";
import httpPutReorderCourses from "../../../controllers/course/http-put-reorder-coursers.ts";
import httpGetMostReadCourses from "../../../controllers/course/http-get-most-read-courses.ts";
import { httpDeleteCourse } from "../../../controllers/course/http-delete-course.ts";
import httpGetCoursesTimeline from "../../../controllers/course/http-get-courses-timeline.ts";
import httpGetCoursesFromModule from "../../../controllers/course/http-get-courses-from-module.ts";
import { moduleIdValidator } from "../modules/module-validators.ts";
import { query } from "express-validator";
import { checkValidatorResult } from "../../../middleware/validators.ts";
import httpGetBestRatedCourses from "../../../controllers/course/http-get-best-rated-courses.ts";
import { httpEnableCourse } from "../../../controllers/course/http-enable-course.ts";
import httpPostImportCourseMbz from "../../../controllers/course/http-post-import-course-mbz.ts";

const courseRouter = express.Router();

/**
 * Configuration du stockage des fichiers uploadés avec multer
 * Les images sont stockées dans le dossier uploads
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(import.meta.dirname, "..", "..", "..", "..", "uploads"));
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

const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // Limite à 100 Mo par exemple pour les gros fichiers de cours
});

// Routes pour la gestion des cours

/**
 * Route POST pour importer un cours depuis un fichier MBZ
 * Nécessite les permissions "course" et une validation du champ "file"
 */
courseRouter.post(
  "/import-mbz",
  checkPermissions("course"),
  memoryUpload.single("file"),
  httpPostImportCourseMbz,
);

/**
 * Route DELETE pour supprimer un cours d'un module
 * Nécessite les permissions "course" et une validation de l'ID du cours
 */
courseRouter.delete(
  "/delete-course/:courseId",
  checkPermissions("course"),
  checkContentAccess("course", "courseId"),
  courseIdValidator,
  httpDeleteCourse,
);

/**
 * Route PUT pour rendre visible un cours
 * Nécessite les permissions "course" et une validation de l'ID du cours
 */
courseRouter.put(
  "/enable-course/:courseId",
  checkPermissions("course"),
  checkContentAccess("course", "courseId"),
  courseIdAndVisibilityValidator,
  httpEnableCourse,
);

/**
 * Route POST pour créer un nouveau cours
 * Nécessite une validation des données du cours
 */
courseRouter.post(
  "/",
  checkPermissions("course", "write"),
  postCourseValidator,
  checkContentAccess("module", "moduleId"),
  httpPostCourse,
);

/**
 * Cette route est utilisée par le module d'importation de cours (ZIP)
 * Nécessite les permissions "course"
 */
courseRouter.post(
  "/import-structure",
  checkPermissions("course"),
  postImportCourseStructureValidator,
  checkContentAccess("module", "moduleId"),
  httpPostImportCourseStructure,
);

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
        if (new Date(maxDate) < new Date(minDate)) {
          throw new Error(
            "maxDate doit être plus grand que minDate ou égal à MinDate",
          );
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

courseRouter.get(
  "/best-rated",
  checkPermissions("course"),
  httpGetBestRatedCourses,
);

/**
 * Route GET pour récupérer les cours d'un module spécifique
 * Nécessite les permissions "course"
 */
courseRouter.get(
  "/:moduleId",
  checkPermissions("course"),
  checkContentAccess("module", "moduleId"),
  httpGetCoursesByModule,
);

/**
 * Route GET pour récupérer les informations d'un cours spécifique
 * Nécessite les permissions "course" et une validation de l'ID du cours
 */
courseRouter.get(
  "/infos/:courseId",
  checkPermissions("course"),
  checkContentAccess("course", "courseId"),
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
  checkContentAccess("module", "moduleId"),
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
  checkContentAccess("course", "courseId"),
  httpPutCourseImage,
);

/**
 * Route PUT pour mettre à jour les informations d'un cours
 * Nécessite les permissions "course" et une validation des données
 */
courseRouter.put(
  "/infos",
  checkPermissions("course"),
  checkContentAccess("course", "id"),
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
  checkContentAccess("course", "courseId"),
  courseTagsValidator,
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
  checkContentAccess("course", "courseId"),
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
  checkContentAccess("course", "courseId"),
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
  checkContentAccess("course", "courseId"),
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
  checkContentAccess("course", "courseId"),
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
  checkContentAccess("course", "courseId"),
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
  checkContentAccess("course", "courseId"),
  courseIdValidator,
  httpGetCourseSkills,
);

// retourne la liste des compétences associés à un cours et au module auquel le cours est rattaché
courseRouter.get(
  "/bonus-skills/:courseId",
  checkPermissions("course", "read"),
  checkContentAccess("course", "courseId"),
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
  checkContentAccess("course", "courseId"),
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
  checkContentAccess("course", "courseId"),
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
  checkContentAccess("course", "courseId"),
  courseIdValidator,
  httpGetCourseScenario,
);

/**
 * Route PUT pour associer plusieurs leçons à un cours
 * Nécessite les permissions "course" et des validations
 */
courseRouter.put(
  "/lessons/:courseId",
  checkPermissions("course"),
  checkContentAccess("course", "courseId"),
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
  checkContentAccess("course", "courseId"),
  courseIdValidator,
  putCourseDatesValidator,
  httpPutCourseDates,
);

// efface une plage de dates du cours
courseRouter.delete(
  "/dates/:courseId/:datesId",
  checkPermissions("course", "delete"),
  checkContentAccess("course", "courseId"),
  courseIdValidator,
  deleteCourseDatesValidator,
  httpDeleteCourseDates,
);

// met à jour le statut publié / brouillon du cours
courseRouter.put(
  "/publish/:courseId",
  courseIdValidator,
  checkPermissions("course"),
  checkContentAccess("course", "courseId"),
  httpPutCourseIsPublished,
);

// retourne la liste des plages de dates associées à un cours
courseRouter.get(
  "/dates/:courseId",
  checkPermissions("role"),
  checkContentAccess("course", "courseId"),
  courseIdValidator,
  httpGetCourseDates,
);

// met à jour l'ordre des cours associés à un module
courseRouter.put(
  "/reorder/:moduleId",
  checkPermissions("course"),
  checkContentAccess("module", "moduleId"),
  putReorderCoursesValidator,
  httpPutReorderCourses,
);

export default courseRouter;

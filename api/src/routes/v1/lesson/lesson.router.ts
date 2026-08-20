import express from "express";
// Middleware d'authentification
// Contrôleurs pour les opérations sur les leçons
import httpPutLesson from "../../../controllers/lesson/http-put-lesson.ts";
// Validateurs pour les différentes routes
import {
  duplicateLessonValidator,
  duplicateResourcesValidator,
  getLessonsByTagValidator,
  lessonIdValidator,
  lessonIdWithRateValidator,
  lessonRateValidator,
  putLessonValidator,
  putReorderLessonsValidator,
} from "./lesson-validator.ts";
// Contrôleurs pour les différentes opérations sur les leçons
import httpGetLessonsByTag from "../../../controllers/lesson/http-get-lessons-by-tag.ts";
// Middleware de vérification des permissions
import checkPermissions from "../../../middleware/check-permissions.ts";
import checkContentAccess from "../../../middleware/check-content-access.ts";
import httpGetLessonsList from "../../../controllers/lesson/http-get-lessons-list.ts";
import httpGetLessonDetail from "../../../controllers/lesson/http-get-losson-detail.ts";
import httpDeleteLesson from "../../../controllers/lesson/http-delete-lesson.ts";
import httpPutReorderLessons from "../../../controllers/lesson/http-put-reorder-lessons.ts";
// Contrôleurs pour le suivi de lecture des leçons
import httpPostBeginReadLesson from "../../../controllers/lesson/http-post-begin-read-lesson.ts";
import httpPutFinishReadLesson from "../../../controllers/lesson/http-put-finish-read-lesson.ts";
import httpGetLastLessonsRead from "../../../controllers/lesson/http-get-last-lessons-read.ts";
import httpGetOneLesson from "../../../controllers/lesson/http-get-one-lesson.ts";
import httpGetLessonRating from "../../../controllers/lesson/http-get-lesson-rating.ts";
import httpPostRateLesson from "../../../controllers/lesson/http-post-rate-lesson.ts";
import httpPutRateLesson from "../../../controllers/lesson/http-put-rate-lesson.ts";
import httpPostDuplicateLesson from "../../../controllers/lesson/http-post-duplicate-lesson.ts";
import httpPostDuplicateResources from "../../../controllers/lesson/http-post-duplicate-resources.ts";

// Création du routeur Express pour les leçons
const lessonRouter = express.Router();

// Route pour mettre à jour une leçon existante
lessonRouter.put(
  "/update",
  checkPermissions("lesson"),
  putLessonValidator,
  httpPutLesson
);

// Route pour obtenir toutes les leçons associées à un tag spécifique
lessonRouter.get(
  "/tag/:tagId",
  checkPermissions("lesson"),
  getLessonsByTagValidator,
  httpGetLessonsByTag
);

// Route pour obtenir la liste complète des leçons
lessonRouter.get("/", checkPermissions("lesson"), httpGetLessonsList);

// Route pour obtenir les dernières leçons lues par l'utilisateur
lessonRouter.get(
  "/last-read",
  checkPermissions("lesson"),
  httpGetLastLessonsRead
);

// Route pour obtenir les détails d'une leçon spécifique
lessonRouter.get(
  "/:lessonId",
  checkPermissions("lesson"),
  checkContentAccess("lesson", "lessonId"),
  lessonIdValidator,
  httpGetLessonDetail
);

lessonRouter.get(
  "/lesson/:lessonId",
  checkPermissions("lesson", "read"),
  checkContentAccess("lesson", "lessonId"),
  httpGetLessonDetail,
);

// Route pour supprimer une leçon
lessonRouter.delete(
  "/:lessonId",
  checkPermissions("lesson"),
  checkContentAccess("lesson", "lessonId"),
  lessonIdValidator,
  httpDeleteLesson
);

// Route pour réorganiser l'ordre des leçons dans un cours
lessonRouter.put(
  "/reorder/:courseId",
  checkPermissions("lesson"),
  putReorderLessonsValidator,
  httpPutReorderLessons
);

// Route pour marquer le début de lecture d'une leçon
lessonRouter.post(
  "/read/:lessonId",
  checkPermissions("lesson", "read"),
  checkContentAccess("lesson", "lessonId"),
  lessonIdValidator,
  httpPostBeginReadLesson
);

lessonRouter.get(
  "/rate/:lessonId",
  checkPermissions("lesson", "read"),
  checkContentAccess("lesson", "lessonId"),
  lessonIdValidator,
  httpGetLessonRating
);

lessonRouter.put(
  "/rate/:lessonId",
  checkPermissions("lesson", "read"),
  checkContentAccess("lesson", "lessonId"),
  lessonIdValidator,
  httpPutRateLesson
);

// Route pour attribuer un avis sous forme de note pour une leçon
lessonRouter.post(
  "/rate/:lessonId",
  checkPermissions("lesson", "read"),
  checkContentAccess("lesson", "lessonId"),
  [...lessonIdValidator, ...lessonRateValidator],
  httpPostRateLesson
);

// Route pour marquer une leçon comme terminée (et noter pour la première fois la leçon)
lessonRouter.put(
  "/read/:lessonId",
  checkPermissions("lesson", "read"),
  checkContentAccess("lesson", "lessonId"),
  lessonIdWithRateValidator,
  httpPutFinishReadLesson
);

lessonRouter.get(
  "/edit/:lessonId",
  checkPermissions("lesson"),
  checkContentAccess("lesson", "lessonId"),
  lessonIdValidator,
  httpGetOneLesson
);

lessonRouter.post(
  "/duplicate/:courseId",
  checkPermissions("lesson"),
  duplicateLessonValidator,
  httpPostDuplicateLesson
);

lessonRouter.post(
  "/duplicate-resources/:courseId",
  checkPermissions("lesson"),
  duplicateResourcesValidator,
  httpPostDuplicateResources,
);

export default lessonRouter;

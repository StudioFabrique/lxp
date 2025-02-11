import express from "express";
// Middleware d'authentification
import checkToken from "../../../middleware/check-token";
// Contrôleurs pour les opérations sur les leçons
import httpPutLesson from "../../../controllers/lesson/http-put-lesson";
// Validateurs pour les différentes routes
import {
  getLessonsByTagValidator,
  lessonIdValidator,
  lessonRateValidator,
  putLessonValidator,
  putReorderLessonsValidator,
} from "./lesson-validator";
// Contrôleurs pour les différentes opérations sur les leçons
import httpGetLessonsByTag from "../../../controllers/lesson/http-get-lessons-by-tag";
// Middleware de vérification des permissions
import checkPermissions from "../../../middleware/check-permissions";
import httpGetLessonsList from "../../../controllers/lesson/http-get-lessons-list";
import httpGetLessonDetail from "../../../controllers/lesson/http-get-losson-detail";
import httpDeleteLesson from "../../../controllers/lesson/http-delete-lesson";
import httpPutReorderLessons from "../../../controllers/lesson/http-put-reorder-lessons";
// Contrôleurs pour le suivi de lecture des leçons
import httpPostBeginReadLesson from "../../../controllers/lesson/http-post-begin-read-lesson";
import httpPutFinishReadLesson from "../../../controllers/lesson/http-put-finish-read-lesson";
import httpGetLastLessonsRead from "../../../controllers/lesson/http-get-last-lessons-read";
import httpGetLessonRating from "../../../controllers/lesson/http-get-lesson-rating";
import httpPostRateLesson from "../../../controllers/lesson/http-post-rate-lesson";

// Création du routeur Express pour les leçons
const lessonRouter = express.Router();

// Route pour mettre à jour une leçon existante
lessonRouter.put(
  "/update",
  checkPermissions("lesson"),
  putLessonValidator,
  httpPutLesson,
);

// Route pour obtenir toutes les leçons associées à un tag spécifique
lessonRouter.get(
  "/tag/:tagId",
  checkPermissions("lesson"),
  getLessonsByTagValidator,
  httpGetLessonsByTag,
);

// Route pour obtenir la liste complète des leçons
lessonRouter.get("/", checkPermissions("lesson"), httpGetLessonsList);

// Route pour obtenir les dernières leçons lues par l'utilisateur
lessonRouter.get(
  "/last-read",
  checkPermissions("lesson"),
  httpGetLastLessonsRead,
);

// Route pour obtenir les détails d'une leçon spécifique
lessonRouter.get(
  "/:lessonId",
  checkPermissions("lesson"),
  lessonIdValidator,
  httpGetLessonDetail,
);

// Route pour supprimer une leçon
lessonRouter.delete(
  "/:lessonId",
  checkPermissions("lesson"),
  lessonIdValidator,
  httpDeleteLesson,
);

// Route pour réorganiser l'ordre des leçons dans un cours
lessonRouter.put(
  "/reorder/:courseId",
  checkPermissions("lesson"),
  putReorderLessonsValidator,
  httpPutReorderLessons,
);

// Route pour marquer le début de lecture d'une leçon
lessonRouter.post(
  "/read/:lessonId",
  checkPermissions("lesson", "read"),
  lessonIdValidator,
  httpPostBeginReadLesson,
);

lessonRouter.get(
  "/rate/:lessonId",
  checkPermissions("lesson", "read"),
  lessonIdValidator,
  httpGetLessonRating,
);

lessonRouter.put(
  "/rate/:rateId",
  checkPermissions("lesson", "read"),
  // httpGetLessonRating,
);

// Route pour attribuer un avis sous forme de note pour une leçon
lessonRouter.post(
  "/rate/:lessonId",
  checkPermissions("lesson", "read"),
  [...lessonIdValidator, ...lessonRateValidator],
  httpPostRateLesson,
);

// Route pour marquer une leçon comme terminée
lessonRouter.put(
  "/read/:lessonId",
  checkPermissions("lesson", "read"),
  lessonIdValidator,
  httpPutFinishReadLesson,
);

export default lessonRouter;

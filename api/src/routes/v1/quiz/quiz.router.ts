import { Router } from "express";
import httpPostRequestRandomQuiz from "../../../controllers/quiz/http-post-request-random-quiz";
import httpGetEndingCourseQuizStream from "../../../controllers/quiz/http-get-ending-course-quiz-stream";
import httpPostPreliminaryQuizStream from "../../../controllers/quiz/http-post-preliminary-quiz-stream";
import {
  endingCourseQuizStreamValidator,
  preliminaryQuizStreamValidator,
  randomQuizValidator,
  reportQuizQuestionValidator,
} from "./quiz-validator";
import checkPermissions from "../../../middleware/check-permissions";
import httpPostReportQuizQuestion from "../../../controllers/quiz/http-post-report-quiz-question";

/**
 * Routeur dédié à la génération de quiz.
 */
const quizRouter = Router();

// Les routes ne nécessitent pour l'instant pas de permission spécifique, uniquement d'être authentifié.

// Récupérer un set de quiz généré par IA (5 questions) pour une fin de cours sous forme de stream.
quizRouter.get(
  "/course/ending/stream/:courseId",
  checkPermissions("quiz", "read"),
  endingCourseQuizStreamValidator,
  httpGetEndingCourseQuizStream,
);

// Récupérer un quiz aléatoire (1 question) généré par l'IA en passant un contenu textuel (activité en cours par exemple).
quizRouter.post(
  "/random",
  checkPermissions("quiz", "write"),
  randomQuizValidator,
  httpPostRequestRandomQuiz,
);

// Récupérer un set de quiz diagnostique généré par IA pour le début d'un module sous forme de stream SSE.
quizRouter.post(
  "/preliminary/stream",
  checkPermissions("quiz", "write"),
  preliminaryQuizStreamValidator,
  httpPostPreliminaryQuizStream,
);

quizRouter.post(
  "/question/report",
  checkPermissions("quiz", "write"),
  reportQuizQuestionValidator,
  httpPostReportQuizQuestion,
);

export default quizRouter;

import { Router } from "express";
import httpPostRequestRandomQuiz from "../../../controllers/quiz/http-post-request-random-quiz.ts";
import httpGetEndingCourseQuizStream from "../../../controllers/quiz/http-get-ending-course-quiz-stream.ts";
import httpPostPreliminaryQuizStream from "../../../controllers/quiz/http-post-preliminary-quiz-stream.ts";
import {
  endingCourseQuizStreamValidator,
  finishQuizAttemptValidator,
  postQuizAnswerValidator,
  postQuizAttemptValidator,
  preliminaryQuizStreamValidator,
  randomQuizValidator,
  reportQuizQuestionValidator,
} from "./quiz-validator.ts";
import checkPermissions from "../../../middleware/check-permissions.ts";
import httpPostReportQuizQuestion from "../../../controllers/quiz/http-post-report-quiz-question.ts";
import httpPostQuizAttempt from "../../../controllers/quiz/http-post-quiz-attempt.ts";
import httpPostQuizAnswer from "../../../controllers/quiz/http-post-quiz-answer.ts";
import httpPutFinishQuizAttempt from "../../../controllers/quiz/http-put-finish-quiz-attempt.ts";

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

// Suivi des passations. Sans ces trois routes, rien de ce que fait
// l'apprenant dans un quiz n'atteint la base : score et réponses ne vivaient
// que dans le state React et disparaissaient à la fermeture de la modale.
quizRouter.post(
  "/attempt",
  checkPermissions("quiz", "write"),
  postQuizAttemptValidator,
  httpPostQuizAttempt,
);

quizRouter.post(
  "/attempt/:attemptId/answer",
  checkPermissions("quiz", "write"),
  postQuizAnswerValidator,
  httpPostQuizAnswer,
);

// `write` et non `update` : les apprenants n'ont l'action `update` que sur
// `cursus`, un PUT gardé par `quiz:update` leur renverrait 403.
quizRouter.put(
  "/attempt/:attemptId/finish",
  checkPermissions("quiz", "write"),
  finishQuizAttemptValidator,
  httpPutFinishQuizAttempt,
);

export default quizRouter;

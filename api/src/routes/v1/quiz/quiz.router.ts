import { Router } from "express";
import httpPostRequestRandomQuiz from "../../../controllers/quiz/http-post-request-random-quiz";
import httpGetEndingCourseQuizStream from "../../../controllers/quiz/http-get-ending-course-quiz-stream";

/**
 * Routeur dédié à la génération de quiz
 */
const quizRouter = Router();

// Récupérer un set de quiz généré par IA (5 questions) pour une fin de cours sous forme de stream.
quizRouter.get(
  "/course/ending/stream/:courseId",
  httpGetEndingCourseQuizStream,
);

// Récupérer un quiz aléatoire (1 question) génèré par l'IA en passant un contenu textuel (activité en cours par exemple).
quizRouter.post("/content", httpPostRequestRandomQuiz);

/**
 * Recupérer un set de quiz pour un module.
 * Les question sont orientés pour savoir les connaissance d'un étudiant
 * sur un module.
 * Endpoint utilisée généralement avant que l'étudiant entame un module.
 */
quizRouter.post("/module/starting");

export default quizRouter;

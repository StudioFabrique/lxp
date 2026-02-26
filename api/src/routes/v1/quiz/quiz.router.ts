import { Router } from "express";
import httpPostRequestQuizFromContent from "../../../controllers/activity/http-post-request-quiz-from-content";

/**
 * Routeur dédié à la génération de quiz
 */
const quizRouter = Router();

// Récupérer un quiz (1 question) en passant un contenu textuel.
quizRouter.post("/content", httpPostRequestQuizFromContent);

/**
 * Recupérer un set de quiz pour un module.
 * Les question sont orientés pour savoir les connaissance d'un étudiant
 * sur un module.
 * Endpoint utilisée généralement avant que l'étudiant entame un module.
 */
quizRouter.post("/module/starting");

// Récupérer un set de quiz généré par IA (5 questions) pour une fin de cours
quizRouter.post("/course/:courseId");

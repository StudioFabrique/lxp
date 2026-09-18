// Import du module Express
import express from "express";

// Import des différents routeurs pour l'authentification et la gestion des utilisateurs
import authRouter from "./auth/auth.router.ts";
import userRouter from "./user/user.router.ts";
import groupRouter from "./group.router.ts";

// Import des routeurs liés au parcours pédagogique
import parcoursRouter from "./parcours/parcours.router.ts";
import skillsRouter from "./skills.router.ts";
import tagRouter from "./tags/tag.router.ts";
import formationRouter from "./formation/formation.router.ts";
import objectiveRouter from "./objective/objective.router.ts";
import moduleRouter from "./modules/module-router.ts";
import bonusSkillRouter from "./bonus-skill.router.ts";

// Import des routeurs liés aux permissions et à la gestion des cours
import permissionRouter from "./permission/permission.router.ts";
import courseRouter from "./course/course.router.ts";
import lessonRouter from "./lesson/lesson.router.ts";
import contentReadRouter from "./content-read/content-read.router.ts";
import checkPermissions from "../../middleware/check-permissions.ts";
import checkRoleRank from "../../middleware/check-role-rank.ts";
import activityRouter from "./activity/activityRouter.ts";
import quizRouter from "./quiz/quiz.router.ts";

// Import des routeurs pour les statistiques, évaluations et médias
import statsRouter from "./stats.router.ts";
import indicatorsRouter from "./indicators/indicators.router.ts";
import evaluationRouter from "./evaluation/evaluation.router.ts";
import mediaRouter from "./mediatheque/mediatheque.router.ts";
import { uploadCompanyLogo } from "../../middleware/upload-company-image.ts";
import httpPostCompanyLogo from "../../controllers/http-post-company-logo.ts";
import httpDeleteCompanyLogo from "../../controllers/http-delete-company-logo.ts";
import resourcesRouter from "./resources/resources.router.ts";
import chatbotRouter from "./chatbot/chatbot.router.ts";
import dashboardIa from "./dashboard-ia/dashboard-ia-router.ts";
import demoRouter from "./demo/demo.router.ts";
import assignmentRouter from "./assignment/assignment.router.ts";
import { mountRouter } from "../../utils/express/route-registry.ts";
import {
  httpGetInstanceSettings,
  httpPutInstanceSettings,
} from "../../controllers/http-instance-settings.ts";

// Création du routeur principal pour l'API v1
const v1Router = express.Router();

// Mode démonstration : configuration d'exécution et ouverture de session.
// Monté en tête et sans garde, ces routes devant répondre à un visiteur anonyme.
mountRouter(v1Router, "/demo", demoRouter);

// Routes d'authentification et de gestion des utilisateurs
mountRouter(v1Router, "/auth", authRouter);
mountRouter(v1Router, "/user", userRouter);
mountRouter(v1Router, "/group", groupRouter);

// Routes liées au parcours pédagogique
mountRouter(v1Router, "/parcours", parcoursRouter);
mountRouter(v1Router, "/skills", skillsRouter);
mountRouter(v1Router, "/tag", tagRouter);
mountRouter(v1Router, "/formation", formationRouter);
mountRouter(v1Router, "/bonus-skill", bonusSkillRouter);
mountRouter(v1Router, "/objective", objectiveRouter);
mountRouter(v1Router, "/modules", moduleRouter);

// Routes de gestion des permissions et des cours
mountRouter(v1Router, "/permission", permissionRouter);
mountRouter(v1Router, "/course", checkPermissions("course"), courseRouter);
mountRouter(v1Router, "/lesson", lessonRouter);
mountRouter(v1Router, "/content-read", contentReadRouter);
mountRouter(v1Router, "/assignment", assignmentRouter);
mountRouter(v1Router, "/activity", activityRouter);

// Routes pour les statistiques, évaluations et médias
mountRouter(v1Router, "/stats", statsRouter);
mountRouter(v1Router, "/indicators", indicatorsRouter);
mountRouter(v1Router, "/evaluation", evaluationRouter);
mountRouter(v1Router, "/media", mediaRouter);
mountRouter(v1Router, "/resources", resourcesRouter);

// Route pour les quiz

mountRouter(v1Router, "/quiz", quizRouter);

v1Router.post(
  "/company-logo",
  checkPermissions("formation"),
  checkRoleRank([0]),
  uploadCompanyLogo(),
  httpPostCompanyLogo,
);

v1Router.delete(
  "/company-logo",
  checkPermissions("formation"),
  checkRoleRank([0]),
  httpDeleteCompanyLogo,
);

v1Router.get("/instance-settings", httpGetInstanceSettings);
v1Router.put(
  "/instance-settings",
  checkPermissions("formation"),
  checkRoleRank([0]),
  uploadCompanyLogo(),
  httpPutInstanceSettings,
);

mountRouter(v1Router, "/chatbot", chatbotRouter);

mountRouter(v1Router, "/dashboard-ia", dashboardIa);

export default v1Router;

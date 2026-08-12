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
import checkPermissions from "../../middleware/check-permissions.ts";
import activityRouter from "./activity/activityRouter.ts";
import quizRouter from "./quiz/quiz.router.ts";

// Import des routeurs pour les statistiques, évaluations et médias
import statsRouter from "./stats.router.ts";
import evaluationRouter from "./evaluation/evaluation.router.ts";
import mediaRouter from "./mediatheque/mediatheque.router.ts";
import { uploadCompanyLogo } from "../../middleware/upload-company-image.ts";
import httpPostCompanyLogo from "../../controllers/http-post-company-logo.ts";
import httpDeleteCompanyLogo from "../../controllers/http-delete-company-logo.ts";
import resourcesRouter from "./resources/resources.router.ts";
import chatbotRouter from "./chatbot/chatbot.router.ts";
import dashboardIa from "./dashboard-ia/dashboard-ia-router.ts";

// Création du routeur principal pour l'API v1
const v1Router = express.Router();

// Routes d'authentification et de gestion des utilisateurs
v1Router.use("/auth", authRouter);
v1Router.use("/user", userRouter);
v1Router.use("/group", groupRouter);

// Routes liées au parcours pédagogique
v1Router.use("/parcours", parcoursRouter);
v1Router.use("/skills", skillsRouter);
v1Router.use("/tag", tagRouter);
v1Router.use("/formation", formationRouter);
v1Router.use("/bonus-skill", bonusSkillRouter);
v1Router.use("/objective", objectiveRouter);
v1Router.use("/modules", moduleRouter);

// Routes de gestion des permissions et des cours
v1Router.use("/permission", permissionRouter);
v1Router.use("/course", checkPermissions("course"), courseRouter);
v1Router.use("/lesson", lessonRouter);
v1Router.use("/activity", activityRouter);

// Routes pour les statistiques, évaluations et médias
v1Router.use("/stats", statsRouter);
v1Router.use("/evaluation", evaluationRouter);
v1Router.use("/media", mediaRouter);
v1Router.use("/resources", resourcesRouter);

// Route pour les quiz

v1Router.use("/quiz", quizRouter);

v1Router.post(
  "/company-logo",
  checkPermissions("formation"),
  uploadCompanyLogo(),
  httpPostCompanyLogo,
);

v1Router.delete(
  "/company-logo",
  checkPermissions("formation"),
  httpDeleteCompanyLogo,
);

v1Router.use("/chatbot", chatbotRouter);

v1Router.use("/dashboard-ia", dashboardIa);

export default v1Router;

// Import du module Express
import express from "express";

// Import des différents routeurs pour l'authentification et la gestion des utilisateurs
import authRouter from "./auth/auth.router";
import userRouter from "./user/user.router";
import groupRouter from "./group.router";

// Import des routeurs liés au parcours pédagogique
import parcoursRouter from "./parcours/parcours.router";
import skillsRouter from "./skills.router";
import tagRouter from "./tags/tag.router";
import formationRouter from "./formation/formation.router";
import objectiveRouter from "./objective/objective.router";
import moduleRouter from "./modules/module-router";
import bonusSkillRouter from "./bonus-skill.router";

// Import des routeurs liés aux permissions et à la gestion des cours
import permissionRouter from "./permission/permission.router";
import courseRouter from "./course/course.router";
import lessonRouter from "./lesson/lesson.router";
import checkPermissions from "../../middleware/check-permissions";
import activityRouter from "./activity/activityRouter";

// Import des routeurs pour la recherche
import searchRouter from "./search/search.router";
import restrictedSearchRouter from "./search/restricted-search.router";

// Import des routeurs pour les statistiques, évaluations et médias
import statsRouter from "./stats.router";
import evaluationRouter from "./evaluation/evaluation.router";
import mediaRouter from "./mediatheque/mediatheque.router";
import { uploadCompanyLogo } from "../../middleware/upload-company-image";
import httpPostCompanyLogo from "../../controllers/http-post-company-logo";
import resourcesRouter from "./resources/resources.router";

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

/**
 * Routes de recherche dédié à elastic search :
 */
v1Router.use("/search", searchRouter); // recherche en tant que admin
v1Router.use("/restrictedSearch", restrictedSearchRouter); // recherche en tant qu'utilisateur normal

v1Router.post(
  "/company-logo",
  checkPermissions("formation"),
  uploadCompanyLogo(),
  httpPostCompanyLogo
);

export default v1Router;

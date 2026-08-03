import express from "express";
import checkPermissions from "../../middleware/check-permissions.ts";
import httpGetLessonsStats from "../../controllers/stats/http-lessons-stats.ts";
import httpGetParcoursStats from "../../controllers/stats/http-parcours-stats.ts";
import { param } from "express-validator";

const statsRouter = express.Router();

statsRouter.get(
  "/lessons-read",
  checkPermissions("stats", "read"),
  httpGetLessonsStats,
);
statsRouter.get(
  "/parcours/:id",
  checkPermissions("stats", "read"),
  param("id").isMongoId().withMessage("ID de groupe invalide"),
  httpGetParcoursStats,
);

export default statsRouter;

import express from "express";
import checkToken from "../../middleware/check-token";
import httpGetLessonsStats from "../../controllers/stats/http-lessons-stats";
import httpGetParcoursStats from "../../controllers/stats/http-parcours-stats";
import { param } from "express-validator";

const statsRouter = express.Router();

statsRouter.get("/lessons-read", checkToken, httpGetLessonsStats);
statsRouter.get(
  "/parcours/:id",
  checkToken,
  param("id").isMongoId().withMessage("ID de groupe invalide"),
  httpGetParcoursStats,
);

export default statsRouter;

import express from "express";
import checkToken from "../../middleware/check-token";
import httpGetLessonsStats from "../../controllers/stats/http-lessons-stats";
import httpGetParcoursStats from "../../controllers/stats/http-parcours-stats";

const statsRouter = express.Router();

statsRouter.get("/lessons-read", checkToken, httpGetLessonsStats);
statsRouter.get("/parcours", checkToken, httpGetParcoursStats);

export default statsRouter;

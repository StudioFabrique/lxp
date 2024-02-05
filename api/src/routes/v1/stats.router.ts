import express from "express";
import checkToken from "../../middleware/check-token";
import httpGetLessonsStats from "../../controllers/stats/http-lessons-stats";

const statsRouter = express.Router();

statsRouter.get("/lessons-read", checkToken, httpGetLessonsStats);

export default statsRouter;

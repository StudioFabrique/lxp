import express from "express";
import checkToken from "../../middleware/check-token";
import { param } from "express-validator";

import httpDeleteObjective from "../../controllers/objective/http-delete-objective";

const objectiveRouter = express.Router();

objectiveRouter.delete(
  "/:objectiveId",
  //checkToken,
  param("objectiveId").isNumeric().notEmpty().escape(),
  httpDeleteObjective
);

export default objectiveRouter;

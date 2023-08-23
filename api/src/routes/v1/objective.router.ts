import express from "express";
import checkToken from "../../middleware/check-token";
import { body, param } from "express-validator";

import httpDeleteObjective from "../../controllers/objective/http-delete-objective";
import httpPutObjective from "../../controllers/objective/http-put-objective";

const objectiveRouter = express.Router();

objectiveRouter.delete(
  "/:objectiveId",
  //checkToken,
  param("objectiveId").isNumeric().notEmpty().escape(),
  httpDeleteObjective
);

objectiveRouter.put(
  "/",
  checkToken,
  //body("*").isObject().notEmpty(),
  body("*.id").isNumeric().notEmpty().escape(),
  body("*.description").isString().notEmpty(),
  httpPutObjective
);

export default objectiveRouter;

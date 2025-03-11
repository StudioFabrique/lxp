import express from "express";
import checkToken from "../../../middleware/check-token";
import { body, param } from "express-validator";

import httpDeleteObjective from "../../../controllers/objective/http-delete-objective";
import httpPutObjective from "../../../controllers/objective/http-put-objective";
import checkPermissions from "../../../middleware/check-permissions";
import { putObjectiveValidator } from "./objective-validators";

const objectiveRouter = express.Router();

objectiveRouter.delete(
  "/:objectiveId",
  checkPermissions("objective"),
  //checkToken,
  param("objectiveId").isNumeric().notEmpty().escape(),
  httpDeleteObjective
);

objectiveRouter.put(
  "/",
  checkPermissions("objective"),
  putObjectiveValidator,
  httpPutObjective
);

export default objectiveRouter;

import express from "express";
import checkToken from "../../../middleware/check-token.ts";
import { body, param } from "express-validator";

import httpDeleteObjective from "../../../controllers/objective/http-delete-objective.ts";
import httpPutObjective from "../../../controllers/objective/http-put-objective.ts";
import checkPermissions from "../../../middleware/check-permissions.ts";
import { putObjectiveValidator } from "./objective-validators.ts";

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

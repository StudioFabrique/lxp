import express from "express";
import { param } from "express-validator";

import httpGetParcoursByFormation from "../../../controllers/parcours/http-get-parcours-by-formation";

const httpGetParcoursByFormationRouter = express.Router();

httpGetParcoursByFormationRouter.get(
  "/:formationId",
  param("formationId").isNumeric().notEmpty().escape(),
  httpGetParcoursByFormation
);

export default httpGetParcoursByFormationRouter;

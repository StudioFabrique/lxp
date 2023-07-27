import express from "express";

import httpGetParcoursByFormation from "../../../controllers/parcours/http-get-parcours-by-formation";
import { param } from "express-validator";

const httpGetParcoursByFormationRouter = express.Router();

httpGetParcoursByFormationRouter.get(
  "/:formationId",
  param("formationId").isNumeric().notEmpty().escape(),
  httpGetParcoursByFormation
);

export default httpGetParcoursByFormationRouter;

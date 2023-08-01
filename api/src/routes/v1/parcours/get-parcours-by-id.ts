import express from "express";
import { param } from "express-validator";

import httpGetParcoursById from "../../../controllers/parcours/http-get-parcours-by-id";

const getParcoursByIdRouter = express.Router();

getParcoursByIdRouter.get(
  "/:parcoursId",
  param("parcoursId").isNumeric().notEmpty().escape(),
  httpGetParcoursById
);

export default getParcoursByIdRouter;

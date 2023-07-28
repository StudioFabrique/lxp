import express from "express";

import httpCreateParcours from "../../../controllers/parcours/http-create-parcours";
import { body } from "express-validator";

const httpCreateParcoursRouter = express.Router();

httpCreateParcoursRouter.post(
  "/",
  body("title")
    .isString()
    .notEmpty()
    .withMessage("Chaîne de caractères attendue.")
    .trim()
    .escape(),
  body("formation").isNumeric().notEmpty(),
  httpCreateParcours
);

export default httpCreateParcoursRouter;

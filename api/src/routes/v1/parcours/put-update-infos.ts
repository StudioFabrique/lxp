import express from "express";
import { body } from "express-validator";

import httpUpdateParcoursInfos from "../../../controllers/parcours/http-update-parcours-infos";

const putUpdateInfosRouter = express.Router();

putUpdateInfosRouter.put(
  "/",
  body("parcoursId").isNumeric().notEmpty().escape(),
  body("title").isString().notEmpty().escape(),
  body("description").isString().notEmpty().escape(),
  body("formation").isNumeric().notEmpty().escape(),
  httpUpdateParcoursInfos
);

export default putUpdateInfosRouter;

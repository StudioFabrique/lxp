import express from "express";
import { body } from "express-validator";

import httpPutParcoursTags from "../../../controllers/parcours/http-put-parcours-tags";

const putParcoursTagsRouter = express.Router();

putParcoursTagsRouter.put(
  "/",
  body("parcoursId").isNumeric().notEmpty(),
  body("tags").isArray().notEmpty(),
  body("tags.*").isNumeric().notEmpty(),
  httpPutParcoursTags
);

export default putParcoursTagsRouter;

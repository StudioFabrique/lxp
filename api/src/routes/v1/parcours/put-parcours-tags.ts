import express from "express";
import httpPutParcoursTags from "../../../controllers/tag/http-put-parcours-tags";
import { body } from "express-validator";

const putParcoursTagsRouter = express.Router();

putParcoursTagsRouter.put(
  "/",
  body("parcoursId").isNumeric().notEmpty().escape(),
  body("tags").isArray().notEmpty(),
  body("tags.*").isNumeric().notEmpty().escape(),
  httpPutParcoursTags
);

export default putParcoursTagsRouter;

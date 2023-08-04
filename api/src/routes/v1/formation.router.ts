import express from "express";
import httpGetFormation from "../../controllers/formation/http-get-formation";
import httpPutFormationTags from "../../controllers/formation/htttp-put-formation-tags";
import { body } from "express-validator";

const formationRouter = express.Router();

formationRouter.get("/", httpGetFormation);
formationRouter.put(
  "/update-tags",
  body("formationId").isNumeric().notEmpty().escape(),
  body("tags").isArray().notEmpty(),
  body("tags.*").isNumeric().notEmpty().escape(),
  httpPutFormationTags
);

export default formationRouter;

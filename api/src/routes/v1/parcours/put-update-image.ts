import express from "express";
import { body } from "express-validator";
import httpUpdateImage from "../../../controllers/parcours/http-update-image";

const putUpdateImageRouter = express.Router();

putUpdateImageRouter.put(
  "/",
  body("parcoursId").isNumeric().notEmpty().escape(),
  body("image").escape(),
  httpUpdateImage
);

export default putUpdateImageRouter;

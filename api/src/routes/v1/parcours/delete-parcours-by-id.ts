import express from "express";
import { param } from "express-validator";
import httpDeleteParcoursById from "../../../controllers/parcours/http-delete-parcours-by-id";

const deleteParcoursByIdRouter = express.Router();

deleteParcoursByIdRouter.delete(
  "/:parcoursId",
  param("parcoursId").isNumeric().notEmpty().escape(),
  httpDeleteParcoursById
);

export default deleteParcoursByIdRouter;

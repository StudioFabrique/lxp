import express from "express";
import { body } from "express-validator";
import httpUpdateParcoursDates from "../../../controllers/parcours/http-update-parcours-dates";

const putUpdateDatesRouter = express.Router();

putUpdateDatesRouter.put(
  "/",
  body("parcoursId").isNumeric().notEmpty().escape(),
  body("startDate").isDate().notEmpty().escape(),
  body("endDate").isDate().notEmpty().escape(),
  httpUpdateParcoursDates
);

export default putUpdateDatesRouter;

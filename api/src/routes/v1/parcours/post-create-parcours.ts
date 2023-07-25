import express from "express";
import httpCreateParcours from "../../../controllers/parcours/http-create-parcours";
import isUser from "../../../middleware/is-user";
import { body } from "express-validator";

const httpCreateParcoursRouter = express.Router();

httpCreateParcoursRouter.post(
  "/",
  body("contacts")
    .isArray()
    .notEmpty()
    .withMessage("Le tableau contacts ne peut pas être vide."),
  body("contacts.*")
    .isString()
    .withMessage(
      "Chaque élément de contact doit être une chaîne de caractères."
    )
    .trim()
    .escape(),
  body("tags")
    .isArray()
    .notEmpty()
    .withMessage("Le tableau tags ne peut pas être vide."),
  body("tags.*")
    .isNumeric()
    .withMessage("Les éléments de tags doivent être des chaînes de caractères.")
    .trim()
    .escape(),
  body("title")
    .isString()
    .withMessage("Chaîne de caractères attendue.")
    .trim()
    .escape(),
  body("description")
    .isString()
    .withMessage("Chaîne de caractères attendue.")
    .trim()
    .escape(),
  body("degree")
    .isString()
    .withMessage("Chaîne de caractères attendue.")
    .trim()
    .escape(),
  body("startDate")
    .isString()
    .withMessage("Chaîne de caractères attendue.")
    .trim()
    .escape(),
  body("endDate")
    .isString()
    .withMessage("Chaîne de caractères attendue.")
    .trim()
    .escape(),
  body("image")
    .isString()
    .withMessage("Chaîne de caractères attendue.")
    .trim()
    .escape(),
  isUser,
  httpCreateParcours
);

export default httpCreateParcoursRouter;

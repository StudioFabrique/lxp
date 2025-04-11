import express from "express";
import { body } from "express-validator";

import httpPutParcoursSkills from "../../../controllers/parcours/http-put-parcours-skills";
import { stringValidateGeneric } from "../../../helpers/custom-validators";

const putParcoursSkillsRouter = express.Router();

putParcoursSkillsRouter.put(
  "/",
  body("parcoursId")
    .isNumeric()
    .notEmpty()
    .withMessage("Identifiant de parcours absent"),
  body("skills").isArray().notEmpty().withMessage("Aucune compétence fournie"),
  body("skills.*.id")
    .isNumeric()
    .notEmpty()
    .withMessage("Identifiant de compétence absent"),
  body("skills.*.description")
    .isString()
    .notEmpty()
    .withMessage("Description de compétence absente")
    .custom(stringValidateGeneric)
    .withMessage(
      "Description de compétence contient des caractères non autorisés"
    ),

  httpPutParcoursSkills
);

export default putParcoursSkillsRouter;

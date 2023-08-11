import express from "express";
import { body } from "express-validator";

import httpPutParcoursSkills from "../../../controllers/parcours/http-put-parcours-skills";

const putParcoursSkillsRouter = express.Router();

putParcoursSkillsRouter.put(
  "/" /* 
  body("parcoursId").isNumeric().notEmpty().escape(),
  body("skills").isArray().notEmpty(),
  body("skills.description").isString().notEmpty().escape(), */,
  httpPutParcoursSkills
);

export default putParcoursSkillsRouter;

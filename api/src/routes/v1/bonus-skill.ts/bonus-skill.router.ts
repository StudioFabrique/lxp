import express from "express";
import { body, param } from "express-validator";

import httpPostBonusSkill from "../../../controllers/bonus-skill/http-post-bonus-skill";
import httpDeleteBonusSkill from "../../../controllers/bonus-skill/http-delete-bonus-skill";
import httpGetBonusSkillsFromParcours from "../../../controllers/bonus-skill/http-get-bonus-skills-from-parcours";

const bonusSkillRouter = express.Router();

bonusSkillRouter.post(
  "/",
  body("skill.description").isString().notEmpty().escape(),
  httpPostBonusSkill
);

bonusSkillRouter.delete(
  "/:id",
  param("id").isNumeric().notEmpty(),
  httpDeleteBonusSkill
);

bonusSkillRouter.get("/", httpGetBonusSkillsFromParcours);

export default bonusSkillRouter;

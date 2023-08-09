import express from "express";
import { body, param } from "express-validator";

import httpPostBonusSkill from "../../../controllers/bonus-skill/http-post-bonus-skill";
import httpDeleteBonusSkill from "../../../controllers/bonus-skill/http-delete-bonus-skill";

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

export default bonusSkillRouter;

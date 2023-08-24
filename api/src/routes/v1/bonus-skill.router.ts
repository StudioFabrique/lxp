import express from "express";
import { body, param } from "express-validator";

import httpPostBonusSkill from "../../controllers/bonus-skill/http-post-bonus-skill";
import httpDeleteBonusSkill from "../../controllers/bonus-skill/http-delete-bonus-skill";
import httpGetBonusSkillsFromParcours from "../../controllers/bonus-skill/http-get-bonus-skills-from-parcours";
import httpPostManySkills from "../../controllers/bonus-skill/http-post-many-skills";
import httpPutBonusSkill from "../../controllers/bonus-skill/http-put-skill";

const bonusSkillRouter = express.Router();

bonusSkillRouter.post(
  "/",
  body("parcoursId").isNumeric().notEmpty(),
  body("skill.description").isString().notEmpty().escape(),
  httpPostBonusSkill
);

bonusSkillRouter.post(
  "/skills",
  //body("parcoursId").isNumeric().notEmpty(),
  body("skills").isArray().notEmpty(),
  body("skills.*.description").isString().notEmpty(),
  httpPostManySkills
);

bonusSkillRouter.delete(
  "/:id",
  param("id").isNumeric().notEmpty(),
  httpDeleteBonusSkill
);

bonusSkillRouter.put("/", httpPutBonusSkill);

bonusSkillRouter.get("/", httpGetBonusSkillsFromParcours);

export default bonusSkillRouter;

import express from "express";
import { body, param } from "express-validator";

import httpPostBonusSkill from "../../controllers/bonus-skill/http-post-bonus-skill.ts";
import httpDeleteBonusSkill from "../../controllers/bonus-skill/http-delete-bonus-skill.ts";
import httpGetBonusSkillsFromParcours from "../../controllers/bonus-skill/http-get-bonus-skills-from-parcours.ts";
import httpPostManySkills from "../../controllers/bonus-skill/http-post-many-skills.ts";
import httpPutBonusSkill from "../../controllers/bonus-skill/http-put-skill.ts";
import checkPermissions from "../../middleware/check-permissions.ts";
import { stringValidateGeneric } from "../../helpers/custom-validators.ts";

const bonusSkillRouter = express.Router();

bonusSkillRouter.post(
  "/",
  checkPermissions("bonusSkill"),
  body("parcoursId")
    .isNumeric()
    .notEmpty()
    .withMessage("Identifiant de parcours absent"),
  body("skill.description")
    .isString()
    .notEmpty()
    .withMessage("Description de compétence absente")
    .custom(stringValidateGeneric)
    .withMessage(
      "Description de compétence contient des caractères non autorisés"
    ),
  httpPostBonusSkill
);

bonusSkillRouter.post(
  "/skills",
  checkPermissions("bonusSkill"),
  body("parcoursId").isNumeric().notEmpty(),
  body("skills").isArray().notEmpty(),
  body("skills.*.description")
    .isString()
    .notEmpty()
    .withMessage("Description de compétence absente")
    .custom(stringValidateGeneric)
    .withMessage(
      "Description de compétence contient des caractères non autorisés"
    ),
  httpPostManySkills
);

bonusSkillRouter.delete(
  "/:id",
  checkPermissions("bonusSkill"),
  param("id").isNumeric().notEmpty(),
  httpDeleteBonusSkill
);

bonusSkillRouter.put(
  "/",
  checkPermissions("bonusSkill"),
  body("skill").notEmpty(),
  body("skill.id")
    .isNumeric()
    .notEmpty()
    .withMessage("Identifiant de compétence absent"),
  body("skill.description")
    .isString()
    .notEmpty()
    .withMessage("Description de compétence absente")
    .custom(stringValidateGeneric)
    .withMessage(
      "Description de compétence contient des caractères non autorisés"
    ),
  httpPutBonusSkill
);

bonusSkillRouter.get(
  "/",
  checkPermissions("bonusSkill"),
  httpGetBonusSkillsFromParcours
);

export default bonusSkillRouter;

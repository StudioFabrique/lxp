import express from "express";
import { body, param } from "express-validator";

import httpPostBonusSkill from "../../controllers/bonus-skill/http-post-bonus-skill";
import httpDeleteBonusSkill from "../../controllers/bonus-skill/http-delete-bonus-skill";
import httpGetBonusSkillsFromParcours from "../../controllers/bonus-skill/http-get-bonus-skills-from-parcours";
import httpPostManySkills from "../../controllers/bonus-skill/http-post-many-skills";
import httpPutBonusSkill from "../../controllers/bonus-skill/http-put-skill";
import checkPermissions from "../../middleware/check-permissions";
import { stringValidateGeneric } from "../../helpers/custom-validators";

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
  //body("parcoursId").isNumeric().notEmpty(),
  body("skills").isArray().notEmpty(),
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

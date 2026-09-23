import { Router } from "express";
import httpUpdateUserProfile from "../../../../controllers/user/profile/http-update-user-profile.ts";
import httpGetUserProfileInformation from "../../../../controllers/user/profile/http-get-user-profile.ts";
import { userProfileValidator } from "../../../../middleware/validators.ts";
import httpUpdateUserPassword from "../../../../controllers/user/profile/http-update-user-password.ts";
import { createFileUploadMiddleware } from "../../../../middleware/fileUpload.ts";
import { avatarImageMaxSize } from "../../../../config/images-sizes.ts";
import jsonParser from "../../../../middleware/json-parser.ts";
import checkPermissions from "../../../../middleware/check-permissions.ts";
import httpGetUserProfileSkills from "../../../../controllers/user/profile/http-get-user-profile-skills.ts";
import httpDeleteUserAvatar from "../../../../controllers/user/profile/http-delete-user-avatar.ts";
import { body, param } from "express-validator";
import { checkValidatorResult } from "../../../../middleware/validators.ts";
import {
  httpGetLearningProfile,
  httpPatchLearningProfile,
  httpPutModuleAssessment,
} from "../../../../controllers/user/profile/http-learning-profile.ts";
import {
  FORMATION_LEVELS,
  LEARNING_PACES,
  LEARNING_PREFERENCES,
} from "../../../../config/learning-profile.ts";
import { newPasswordValidate } from "../../../../helpers/custom-validators.ts";

const userProfileRouter = Router();

/**
 * Récupère les informations de l'utilisateur connecté
 */
userProfileRouter.get(
  "/information",
  checkPermissions("cursus", "read"),
  httpGetUserProfileInformation,
);

userProfileRouter.get(
  "/learning",
  checkPermissions("cursus", "read"),
  httpGetLearningProfile,
);

userProfileRouter.patch(
  "/learning",
  checkPermissions("cursus", "update"),
  [
    body("pace").optional().isIn(LEARNING_PACES),
    body("preferences")
      .optional()
      .isArray({ min: 1, max: LEARNING_PREFERENCES.length }),
    body("preferences.*").optional().isIn(LEARNING_PREFERENCES),
    body("currentStep").optional().isString().isLength({ max: 100 }),
    body("action").optional().isIn(["start", "confirm"]),
    checkValidatorResult,
  ],
  httpPatchLearningProfile,
);

userProfileRouter.put(
  "/learning/modules/:moduleId",
  checkPermissions("cursus", "update"),
  [
    param("moduleId").isInt({ min: 1 }),
    body("level").isIn(FORMATION_LEVELS),
    checkValidatorResult,
  ],
  httpPutModuleAssessment,
);

userProfileRouter.get(
  "/skills",
  checkPermissions("bonusSkill", "read"),
  httpGetUserProfileSkills,
);

userProfileRouter.put(
  "/information",
  checkPermissions("cursus", "update"),
  createFileUploadMiddleware(avatarImageMaxSize),
  jsonParser,
  userProfileValidator(true),
  httpUpdateUserProfile,
);

userProfileRouter.put(
  "/password",
  checkPermissions("cursus", "update"),
  body("oldPass").isString().notEmpty(),
  body("newPass").isString().custom(newPasswordValidate),
  checkValidatorResult,
  httpUpdateUserPassword,
);

userProfileRouter.delete(
  "/avatar",
  checkPermissions("cursus", "update"),
  httpDeleteUserAvatar,
);

export default userProfileRouter;

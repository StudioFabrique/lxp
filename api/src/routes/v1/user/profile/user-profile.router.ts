import { Router } from "express";
import httpUpdateUserProfile from "../../../../controllers/user/profile/http-update-user-profile.ts";
import httpGetUserProfileInformation from "../../../../controllers/user/profile/http-get-user-profile.ts";
import { userProfileValidator } from "../../../../middleware/validators.ts";
import httpUpdateUserPassword from "../../../../controllers/user/profile/http-update-user-password.ts";
import { createFileUploadMiddleware } from "../../../../middleware/fileUpload.ts";
import { avatarImageMaxSize } from "../../../../config/images-sizes.ts";
import jsonParser from "../../../../middleware/json-parser.ts";
import checkPermissions from "../../../../middleware/check-permissions.ts";

const userProfileRouter = Router();

/**
 * Récupère les informations de l'utilisateur connecté
 */
userProfileRouter.get(
  "/information",
  checkPermissions("cursus", "read"),
  httpGetUserProfileInformation,
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
  httpUpdateUserPassword,
);

/* userProfileRouter.put(
  "/avatar",
  createFileUploadMiddleware(avatarImageMaxSize),
  httpUpdateUserAvatar
); */

export default userProfileRouter;

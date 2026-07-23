import { Router } from "express";
import httpUpdateUserProfile from "../../../../controllers/user/profile/http-update-user-profile";
import httpGetUserProfileInformation from "../../../../controllers/user/profile/http-get-user-profile";
import { userProfileValidator } from "../../../../middleware/validators";
import httpUpdateUserPassword from "../../../../controllers/user/profile/http-update-user-password";
import { createFileUploadMiddleware } from "../../../../middleware/fileUpload";
import { avatarImageMaxSize } from "../../../../config/images-sizes";
import jsonParser from "../../../../middleware/json-parser";
import checkPermissions from "../../../../middleware/check-permissions";

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

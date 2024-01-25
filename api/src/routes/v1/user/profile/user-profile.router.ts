import { Router } from "express";
import httpUpdateUserProfile from "../../../../controllers/user/profile/http-update-user-profile";
import httpGetUserProfileInformation from "../../../../controllers/user/profile/http-get-user-profile";
import { userValidator } from "../../../../middleware/validators";
import httpUpdateUserPassword from "../../../../controllers/user/profile/http-update-user-password";
import httpUpdateUserAvatar from "../../../../controllers/user/profile/http-update-user-avatar";
import { createFileUploadMiddleware } from "../../../../middleware/fileUpload";
import { avatarImageMaxSize } from "../../../../config/images-sizes";

const userProfileRouter = Router();

/**
 * Récupère les informations de l'utilisateur connecté
 */
userProfileRouter.get("/information", httpGetUserProfileInformation);

userProfileRouter.put("/information", userValidator(), httpUpdateUserProfile);

userProfileRouter.put("/password", httpUpdateUserPassword);

userProfileRouter.put(
  "/avatar",
  createFileUploadMiddleware(avatarImageMaxSize),
  httpUpdateUserAvatar
);

export default userProfileRouter;

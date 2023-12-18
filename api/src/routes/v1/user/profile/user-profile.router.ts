import { Router } from "express";
import httpUpdateUserProfile from "../../../../controllers/user/profile/http-update-user-profile";
import httpGetUserProfileInformation from "../../../../controllers/user/profile/http-get-user-profile";
import { userValidator } from "../../../../middleware/validators";
import httpUpdateUserPassword from "../../../../controllers/user/profile/http-update-user-password";

const userProfileRouter = Router();

/**
 * Récupère les informations de l'utilisateur connecté
 */
userProfileRouter.get("/information", httpGetUserProfileInformation);

userProfileRouter.put(
  "/information/:id",
  userValidator(),
  httpUpdateUserProfile
);

userProfileRouter.put("/password", httpUpdateUserPassword);

export default userProfileRouter;

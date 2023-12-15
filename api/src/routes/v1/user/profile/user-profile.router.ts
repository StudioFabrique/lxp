import { Router } from "express";
import httpUpdateUser from "../../../../controllers/user/profile/http-update-user-profile";
import httpGetUserProfileInformation from "../../../../controllers/user/profile/http-get-user-profile";
import { userValidator } from "../../../../middleware/validators";
import { body } from "express-validator";

const userProfileRouter = Router();

/**
 * Récupère les informations de l'utilisateur connecté
 */
userProfileRouter.get("/information", httpGetUserProfileInformation);

userProfileRouter.put("/information/:id", userValidator(), httpUpdateUser);

export default userProfileRouter;

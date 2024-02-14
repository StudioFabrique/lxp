import express from "express";
import { body } from "express-validator";

import httpLogout from "../../../controllers/auth/http-logout";
import refreshTokens from "../../../middleware/refresh-tokens";
import httpLogin from "../../../controllers/auth/http-login";
import httpHandshake from "../../../controllers/auth/http-handshake";
import checkToken from "../../../middleware/check-token";
import httpGetCurrentRoles from "../../../controllers/auth/http-get-current-roles";
import { passwordValidateGeneric } from "../../../helpers/custom-validators";
import httpGetDisconnect from "../../../controllers/auth/http-get-disconnect";

const authRouter = express.Router();

authRouter.post(
  "/login",
  body("email").isEmail().withMessage("Email invalide").trim().escape(),
  body("password")
    .notEmpty()
    .withMessage("Le mot de passe est requis.")
    .isString()
    .withMessage("Le mot de passe doit être une chaîne de caractères.")
    .custom(passwordValidateGeneric)
    .withMessage("Identifiants incorrects."),
  httpLogin
);
authRouter.get("/handshake", checkToken, httpHandshake);
authRouter.get("/logout", httpLogout);
authRouter.get("/refresh", refreshTokens);
authRouter.get("/roles", checkToken, httpGetCurrentRoles);
authRouter.get("/close", checkToken, httpGetDisconnect);

export default authRouter;

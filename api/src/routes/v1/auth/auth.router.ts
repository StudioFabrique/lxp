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
import httpGetSetupStatus from "../../../controllers/auth/http-get-setup-status";
import httpPostVerifyActivationToken from "../../../controllers/auth/http-post-verify-activation-token";
import httpPostFirstAdmin from "../../../controllers/auth/http-post-first-admin";
import rateLimiter from "../../../middleware/rate-limiter";

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

// Onboarding - setup status (public)
authRouter.get("/setup-status", httpGetSetupStatus);

// Onboarding - verify activation token (public, rate limited)
authRouter.post(
  "/verify-activation-token",
  rateLimiter(5, 60_000),
  body("token")
    .notEmpty()
    .withMessage("Le token est requis.")
    .isString()
    .withMessage("Le token doit être une chaîne de caractères."),
  httpPostVerifyActivationToken
);

// Onboarding - create first admin (public, rate limited)
authRouter.post(
  "/first-admin",
  rateLimiter(3, 60_000),
  body("token")
    .notEmpty()
    .withMessage("Le token est requis.")
    .isString()
    .withMessage("Le token doit être une chaîne de caractères."),
  body("email")
    .isEmail()
    .withMessage("L'adresse email n'est pas valide.")
    .trim()
    .escape(),
  body("firstname")
    .notEmpty()
    .withMessage("Le prénom est requis.")
    .isString()
    .withMessage("Le prénom doit être une chaîne de caractères.")
    .trim()
    .escape(),
  body("lastname")
    .notEmpty()
    .withMessage("Le nom est requis.")
    .isString()
    .withMessage("Le nom doit être une chaîne de caractères.")
    .trim()
    .escape(),
  body("password")
    .notEmpty()
    .withMessage("Le mot de passe est requis.")
    .isString()
    .withMessage("Le mot de passe doit être une chaîne de caractères.")
    .custom(passwordValidateGeneric)
    .withMessage(
      "Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
    ),
  httpPostFirstAdmin
);

export default authRouter;

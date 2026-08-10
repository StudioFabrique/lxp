import express from "express";
import { body } from "express-validator";

import httpLogout from "../../../controllers/auth/http-logout.ts";
import refreshTokens from "../../../middleware/refresh-tokens.ts";
import httpLogin from "../../../controllers/auth/http-login.ts";
import httpHandshake from "../../../controllers/auth/http-handshake.ts";
import checkToken from "../../../middleware/check-token.ts";
import httpGetCurrentRoles from "../../../controllers/auth/http-get-current-roles.ts";
import { passwordValidateGeneric } from "../../../helpers/custom-validators.ts";
import httpGetDisconnect from "../../../controllers/auth/http-get-disconnect.ts";
import httpGetSetupStatus from "../../../controllers/auth/http-get-setup-status.ts";
import httpPostVerifyActivationToken from "../../../controllers/auth/http-post-verify-activation-token.ts";
import httpPostFirstAdmin from "../../../controllers/auth/http-post-first-admin.ts";
import rateLimiter from "../../../middleware/rate-limiter.ts";
import httpGetAuthBackgrounds from "../../../controllers/auth/http-get-auth-backgrounds.ts";
import httpPostResendActivation from "../../../controllers/auth/http-post-resend-activation.ts";
import httpPatchOnboarding from "../../../controllers/auth/http-patch-onboarding.ts";

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

authRouter.post(
  "/resend-activation",
  rateLimiter(5, 60_000),
  body("email")
    .isEmail()
    .withMessage("Adresse email invalide.")
    .normalizeEmail(),
  httpPostResendActivation,
);
authRouter.get("/handshake", checkToken, httpHandshake);
authRouter.get("/logout", httpLogout);
authRouter.get("/refresh", refreshTokens);
authRouter.get("/roles", checkToken, httpGetCurrentRoles);
authRouter.get("/close", checkToken, httpGetDisconnect);
authRouter.patch(
  "/onboarding",
  checkToken,
  body("status")
    .isIn(["pending", "in_progress", "completed", "skipped"])
    .withMessage("Statut d'onboarding invalide."),
  body("step")
    .isString()
    .isLength({ max: 80 })
    .withMessage("Étape d'onboarding invalide."),
  body("version")
    .isInt({ min: 1 })
    .withMessage("Version d'onboarding invalide."),
  httpPatchOnboarding,
);

// Auth screens backgrounds (public, cached)
authRouter.get("/backgrounds", httpGetAuthBackgrounds);

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

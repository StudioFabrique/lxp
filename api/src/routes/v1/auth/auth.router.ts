import express from "express";
import { body } from "express-validator";

import httpLogout from "../../../controllers/auth/http-logout.ts";
import refreshTokens from "../../../middleware/refresh-tokens.ts";
import httpLogin from "../../../controllers/auth/http-login.ts";
import httpHandshake from "../../../controllers/auth/http-handshake.ts";
import checkToken from "../../../middleware/check-token.ts";
import httpGetCurrentRoles from "../../../controllers/auth/http-get-current-roles.ts";
import {
  newPasswordValidate,
  passwordValidateGeneric,
} from "../../../helpers/custom-validators.ts";
import httpGetDisconnect from "../../../controllers/auth/http-get-disconnect.ts";
import httpGetSetupStatus from "../../../controllers/auth/http-get-setup-status.ts";
import httpPostVerifyActivationToken from "../../../controllers/auth/http-post-verify-activation-token.ts";
import httpPostFirstAdmin from "../../../controllers/auth/http-post-first-admin.ts";
import rateLimiter, { clientIp } from "../../../middleware/rate-limiter.ts";
import httpGetAuthBackgrounds from "../../../controllers/auth/http-get-auth-backgrounds.ts";
import httpPostResendActivation from "../../../controllers/auth/http-post-resend-activation.ts";
import httpPatchOnboarding from "../../../controllers/auth/http-patch-onboarding.ts";
import httpPostPromoteRoot from "../../../controllers/auth/http-post-promote-root.ts";
import httpPostRootAccount from "../../../controllers/auth/http-post-root-account.ts";
import httpPostConfirmEmail from "../../../controllers/auth/http-post-confirm-email.ts";

const authRouter = express.Router();

authRouter.post(
  "/login",
  // Sans plafond, l'endpoint accepte autant de tentatives que l'attaquant peut
  // en émettre : `userLogin` ne compte pas les échecs et aucun verrouillage de
  // compte n'existe.
  //
  // Deux portées complémentaires. La première vise le bourrage d'un compte
  // précis. La seconde, bien plus large, arrête le balayage d'une liste
  // d'adresses sans pénaliser un établissement dont les postes sortent tous
  // par la même IP publique.
  rateLimiter(
    10,
    15 * 60_000,
    (req) => `login:${clientIp(req)}:${String(req.body?.email ?? "").toLowerCase()}`,
  ),
  rateLimiter(60, 60_000),
  // Pas de `.escape()` ici : l'email sert de critère de recherche, et l'encoder
  // empêcherait une adresse contenant une apostrophe de correspondre.
  body("email").isEmail().withMessage("Email invalide").trim(),
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
authRouter.post(
  "/confirm-email",
  rateLimiter(5, 60_000),
  body("token")
    .notEmpty()
    .withMessage("Le token est requis.")
    .isString()
    .withMessage("Le token doit être une chaîne de caractères."),
  httpPostConfirmEmail,
);
authRouter.get("/handshake", checkToken, httpHandshake);
authRouter.get("/logout", httpLogout);
authRouter.get("/refresh", rateLimiter(30, 60_000), refreshTokens);
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

authRouter.post(
  "/promote-root",
  checkToken,
  rateLimiter(3, 60_000),
  body("token")
    .notEmpty()
    .withMessage("Le token est requis.")
    .isString()
    .withMessage("Le token doit être une chaîne de caractères."),
  httpPostPromoteRoot,
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
    .trim(),
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
    .custom(newPasswordValidate)
    .withMessage(
      "Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
    ),
  httpPostFirstAdmin
);

// Création d'un compte root supplémentaire depuis une invitation envoyée par
// le pipeline. Le token est lié à l'adresse email et n'est utilisable qu'une
// fois, ce qui permet de garder cette route publique.
authRouter.post(
  "/root-account",
  rateLimiter(3, 60_000),
  body("token")
    .notEmpty()
    .withMessage("Le token est requis.")
    .isString()
    .withMessage("Le token doit être une chaîne de caractères."),
  body("email")
    .isEmail()
    .withMessage("L'adresse email n'est pas valide.")
    .trim(),
  body("firstname")
    .notEmpty()
    .withMessage("Le prénom est requis.")
    .isString()
    .trim()
    .escape(),
  body("lastname")
    .notEmpty()
    .withMessage("Le nom est requis.")
    .isString()
    .trim()
    .escape(),
  body("password")
    .notEmpty()
    .withMessage("Le mot de passe est requis.")
    .isString()
    .custom(newPasswordValidate)
    .withMessage(
      "Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
    ),
  httpPostRootAccount,
);

export default authRouter;

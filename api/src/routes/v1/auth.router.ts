import express from "express";
import { body, param } from "express-validator";

import httpLogout from "../../controllers/auth/http-logout";
import refreshTokens from "../../middleware/refresh-tokens";
import httpLogin from "../../controllers/auth/http-login";
import httpHandshake from "../../controllers/auth/http-handshake";
import checkToken from "../../middleware/check-token";
import httpGetRoles from "../../controllers/auth/http-get-roles";

const authRouter = express.Router();

authRouter.post(
  "/login",
  body("email").isEmail().withMessage("Email invalide").trim().escape(),
  httpLogin
);
authRouter.get("/handshake", checkToken, httpHandshake);
authRouter.get("/logout", httpLogout);
authRouter.get("/refresh", refreshTokens);
authRouter.get("/roles", checkToken, httpGetRoles);

export default authRouter;

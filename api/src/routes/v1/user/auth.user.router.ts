import express from "express";
import { body } from "express-validator";

import httpUserLogin from "../../../controllers/auth/user-login";
import httpLogout from "../../../controllers/auth/httpLogout";
import httpHandshake from "../../../controllers/user/httpHandshake";
import isUser from "../../../middleware/isUser";

const userAuth = express.Router();

userAuth.post("/login", body("email").trim().escape().isEmail(), httpUserLogin);
userAuth.get("/logout", httpLogout);
userAuth.get("/handshake", isUser, httpHandshake);

export default userAuth;

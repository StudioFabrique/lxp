import express from "express";
import { body } from "express-validator";

import httpUserLogin from "../../controllers/auth/user-login";
import httpLogout from "../../controllers/auth/httpLogout";

const userAuth = express.Router();

userAuth.post("/login", body("email").trim().escape().isEmail(), httpUserLogin);
userAuth.get("/logout", httpLogout);

export default userAuth;

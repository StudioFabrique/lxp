import express from "express";
import { body } from "express-validator";

import httpUserLogin from "../../controllers/auth/user-login";

const userAuth = express.Router();

userAuth.post("/login", body("email").trim().escape().isEmail(), httpUserLogin);

export default userAuth;

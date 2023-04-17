import express from "express";
import httpUserLogin from "../../controllers/auth/user-login";

const userAuth = express.Router();

userAuth.post("/login", httpUserLogin);

export default userAuth;

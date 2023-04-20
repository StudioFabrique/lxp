import express from "express";
import studentAuth from "./student/auth.student.router";
import userAuth from "./user/auth.user.router";
import refreshToken from "../../middleware/refreshTokens";

const v1Router = express.Router();

v1Router.use("/auth/student", studentAuth);
v1Router.use("/auth/user", userAuth);
v1Router.get("/refresh", refreshToken, refreshToken);

export default v1Router;

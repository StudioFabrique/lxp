import express from "express";
import refreshToken from "../../middleware/refresh-tokens";
import authRouter from "./auth.router";
import userTestRouter from "./userTest.router";

const v1Router = express.Router();

v1Router.use("/auth", authRouter);
v1Router.use("/userTest", userTestRouter);

export default v1Router;

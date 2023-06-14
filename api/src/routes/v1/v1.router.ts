import express from "express";
import authRouter from "./auth.router";
import userRouter from "./user.router";
import groupRouter from "./group.router";
import parcoursRouter from "./parcours.router";

const v1Router = express.Router();

v1Router.use("/auth", authRouter);
v1Router.use("/user", userRouter);
v1Router.use("/group", groupRouter);
v1Router.use("/parcours", parcoursRouter);

export default v1Router;

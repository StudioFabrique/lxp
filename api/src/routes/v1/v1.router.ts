import express from "express";

import authRouter from "./auth.router";
import userRouter from "./user/user.router";
import groupRouter from "./group.router";
import parcoursRouter from "./parcours/parcours.router";
import skillsRouter from "./skills.router";
import tagRouter from "./tag.router";
import formationRouter from "./formation.router";

const v1Router = express.Router();

v1Router.use("/auth", authRouter);
v1Router.use("/user", userRouter);
v1Router.use("/group", groupRouter);
v1Router.use("/parcours", parcoursRouter);
v1Router.use("/skills", skillsRouter);
v1Router.use("/tag", tagRouter);
v1Router.use("/formation", formationRouter);

export default v1Router;

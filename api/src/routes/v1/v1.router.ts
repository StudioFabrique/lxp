import express from "express";
import studentAuth from "./student/auth.student.router";
import userAuth from "./auth.user.router";

const v1Router = express.Router();

v1Router.use("/auth/student", studentAuth);
v1Router.use("/auth/user", userAuth);

export default v1Router;

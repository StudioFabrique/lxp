import express from "express";
import httpGetAllUsers from "../../controllers/user/admin-teacher/httpGetAllUsers";
import { param, query } from "express-validator";

const userRouter = express.Router();

userRouter.get(
  "/:role",
  param("role").trim().escape(),
  query("page").trim().escape().isInt(),
  query("limit").trim().escape().isInt(),
  httpGetAllUsers
);

export default userRouter;

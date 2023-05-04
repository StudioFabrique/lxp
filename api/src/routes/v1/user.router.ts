import express from "express";
import httpGetAllUsers from "../../controllers/user/admin-teacher/httpGetAllUsers";
import { param, query } from "express-validator";

const userRouter = express.Router();

//  récupération de la liste des utilisateurs
userRouter.get(
  "/:role/:stype/:sdir",
  param("role").trim().escape(),
  param("stype").trim().escape(),
  param("sdir").trim().escape(),
  query("page").trim().escape().isInt(),
  query("limit").trim().escape().isInt(),
  httpGetAllUsers
);

export default userRouter;

import express from "express";
import { body } from "express-validator";

import httpPostTeacher from "../../../controllers/user/http-post-teacher";

const postTeacherRouter = express.Router();

postTeacherRouter.post(
  "/",
  body("email").isEmail().notEmpty().trim().escape(),
  body("firstname").isString().notEmpty().trim().escape(),
  body("lastname").isString().notEmpty().trim().escape(),
  body("isActive").isBoolean().notEmpty().trim().escape(),
  body("nickname").isString().trim().escape(),
  body("address").isString().notEmpty().trim().escape(),
  body("postCode").isString().notEmpty().trim().escape(),
  body("city").isString().notEmpty().trim().escape(),
  body("phoneNumber").isString().trim().escape(),
  httpPostTeacher
);

export default postTeacherRouter;

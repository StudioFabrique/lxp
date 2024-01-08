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
  body("nickname").isString().trim().escape().optional(),
  body("address").isString().trim().escape().optional(),
  body("postCode").isString().trim().escape().optional(),
  body("city").isString().trim().escape().optional(),
  body("phoneNumber").isString().trim().escape().optional(),
  httpPostTeacher
);

export default postTeacherRouter;

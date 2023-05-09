import express from "express";
import MakeUser from "../../controllers/userTest/make-user";
import { userValidator } from "../../middleware/validators";

const userTestRouter = express.Router();

userTestRouter.post("/", userValidator, MakeUser);

export default userTestRouter;

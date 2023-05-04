import express from "express";
import MakeUser from "../../controllers/userTest/make-user";

const userTestRouter = express.Router();

userTestRouter.post("/", MakeUser);

export default userTestRouter;

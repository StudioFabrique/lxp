import express from "express";
import { userValidator } from "../../middleware/validators";
import httpCreateAdmin from "../../controllers/user/http-create-admin";
import isUser from "../../middleware/is-user";

const adminRouter = express.Router();

adminRouter.post("/", isUser, userValidator, httpCreateAdmin);

export default adminRouter;

import { Router } from "express";
import httpCreateGroup from "../../controllers/group/http-create-group";
import isUser from "../../middleware/is-user";

const groupRouter = Router();

groupRouter.get("/"); // all
groupRouter.get("/:id"); // only one specific
groupRouter.post("/", isUser, httpCreateGroup); // create

export default groupRouter;

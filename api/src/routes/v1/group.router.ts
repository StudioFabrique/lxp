import { Router } from "express";
import httpCreateGroup from "../../controllers/group/http-create-group";
import isUser from "../../middleware/is-user";

const groupRouter = Router();

/* groupRouter.get("/:role/:stype/:sdir");
groupRouter.get("/:id"); */
groupRouter.post("/", isUser, httpCreateGroup);

export default groupRouter;

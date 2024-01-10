import { Router } from "express";
import httpDeleteHobby from "../../../../controllers/user/hobby/http-delete-hobby";
import httpPostHobby from "../../../../controllers/user/hobby/http-post-hobby";

const hobbyRouter = Router();

hobbyRouter.post("/", httpPostHobby);
hobbyRouter.delete("/:id", httpDeleteHobby);

export default hobbyRouter;

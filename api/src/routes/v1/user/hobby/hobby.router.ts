import { Router } from "express";
import httpDeleteHobby from "../../../../controllers/user/hobby/http-delete-hobby";

const hobbyRouter = Router();

hobbyRouter.delete("/:id", httpDeleteHobby);

export default hobbyRouter;

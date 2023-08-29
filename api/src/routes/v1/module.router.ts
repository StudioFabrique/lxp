import { Router } from "express";
import httpCreateModule from "../../controllers/module/http-create-module";

const moduleRouter = Router();

moduleRouter.post("/", httpCreateModule);

export default moduleRouter;

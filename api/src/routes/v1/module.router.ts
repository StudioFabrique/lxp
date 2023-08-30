import { Router } from "express";
import httpCreateModule from "../../controllers/module/http-create-module";
import httpGetAllModules from "../../controllers/module/http-get-all-modules";
import httpUpdateModule from "../../controllers/module/http-update-module";

const moduleRouter = Router();

moduleRouter.get("/:parcoursId", httpGetAllModules);
moduleRouter.post("/", httpCreateModule);
moduleRouter.put("/", httpUpdateModule);

export default moduleRouter;

import { Router } from "express";
import checkToken from "../../../middleware/check-token";
import putModuleImageRouter from "./put-module-parcours";
import httpGetModuleFormation from "../../../controllers/clone/http-get-modules-formation";
import httpParcoursModules from "../../../controllers/clone/http-parcours-modules";

const newModuleRouter = Router();

newModuleRouter.use("/new-module/", checkToken, putModuleImageRouter);
newModuleRouter.get("/formation/:formationId", httpGetModuleFormation);
newModuleRouter.put("/:parcoursId", httpParcoursModules);

export default newModuleRouter;

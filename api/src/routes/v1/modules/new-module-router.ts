import { Router } from "express";
import checkToken from "../../../middleware/check-token";
import putModuleImageRouter from "./put-module-parcours";
import httpGetModuleFormation from "../../../controllers/clone/http-get-modules-formation";
import httpParcoursModules from "../../../controllers/clone/http-parcours-modules";
import httpUpdateDatesModule from "../../../controllers/clone/http-update-dates-module";
import httpUpdateDurationModule from "../../../controllers/clone/http-update-duration-module";

const newModuleRouter = Router();

newModuleRouter.use("/new-module/", checkToken, putModuleImageRouter);
newModuleRouter.get(
  "/formation/:formationId",
  checkToken,
  httpGetModuleFormation
);
newModuleRouter.put("/:parcoursId", httpParcoursModules);
newModuleRouter.put("/calendar/dates", httpUpdateDatesModule);
newModuleRouter.put("/calendar/duration", httpUpdateDurationModule);

export default newModuleRouter;

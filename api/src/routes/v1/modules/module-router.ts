import { Router } from "express";
import checkToken from "../../../middleware/check-token";
import putModuleImageRouter from "./put-module-parcours";
import httpGetModuleFormation from "../../../controllers/module/http-get-modules-formation";
import httpParcoursModules from "../../../controllers/module/http-parcours-modules";
import httpUpdateDatesModule from "../../../controllers/module/http-update-dates-module";
import httpUpdateDurationModule from "../../../controllers/module/http-update-duration-module";

const modules = Router();

modules.use("/new-module/", checkToken, putModuleImageRouter);
modules.get("/formation/:formationId", checkToken, httpGetModuleFormation);
modules.put("/:parcoursId", checkToken, httpParcoursModules);
modules.put("/calendar/dates", checkToken, httpUpdateDatesModule);
modules.put("/calendar/duration", checkToken, httpUpdateDurationModule);

export default modules;

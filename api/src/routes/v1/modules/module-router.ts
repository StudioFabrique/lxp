import { Router } from "express";
import checkToken from "../../../middleware/check-token";
import httpGetModuleFormation from "../../../controllers/module/http-get-modules-formation";
import httpParcoursModules from "../../../controllers/module/http-parcours-modules";
import httpUpdateDatesModule from "../../../controllers/module/http-update-dates-module";
import httpUpdateDurationModule from "../../../controllers/module/http-update-duration-module";
import httpDeleteModule from "../../../controllers/module/http-delete-module";
import httpPutAddModule from "../../../controllers/parcours/http-put-add-module";

const modules = Router();

modules.use("/add-module/:parcoursId/:moduleId", checkToken, httpPutAddModule);
modules.get("/formation/:formationId", checkToken, httpGetModuleFormation);
modules.put("/:parcoursId", checkToken, httpParcoursModules);
modules.put("/calendar/dates", checkToken, httpUpdateDatesModule);
modules.put("/calendar/duration", checkToken, httpUpdateDurationModule);
modules.delete("/:moduleId", checkToken, httpDeleteModule);

export default modules;

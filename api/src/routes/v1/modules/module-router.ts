import { Router } from "express";
import checkToken from "../../../middleware/check-token";
import httpGetModuleFormation from "../../../controllers/module/http-get-modules-formation";
import httpParcoursModules from "../../../controllers/module/http-parcours-modules";
import httpUpdateDatesModule from "../../../controllers/module/http-update-dates-module";
import httpUpdateDurationModule from "../../../controllers/module/http-update-duration-module";
import httpDeleteModule from "../../../controllers/module/http-delete-module";
import httpPutAddModule from "../../../controllers/parcours/http-put-add-module";
import putModuleImageRouter from "./put-module-parcours";
import httpGetModulesFromParcours from "../../../controllers/module/http-get-modules-from-parcours";
import { getModulesFromParcoursValidator } from "./module-validators";
import checkPermissions from "../../../middleware/check-permissions";

const modules = Router();

modules.put(
  "/add-module/:parcoursId/:moduleId",
  checkPermissions("module"),
  // checkToken,
  httpPutAddModule
);
modules.get(
  "/formation/:formationId",
  checkPermissions("module"),
  // checkToken,
  httpGetModuleFormation
);
modules.put(
  "/:parcoursId",
  checkPermissions("module"),
  // checkToken,
  httpParcoursModules
);
modules.put(
  "/calendar/dates",
  checkPermissions("module"),
  // checkToken,
  httpUpdateDatesModule
);
modules.put(
  "/calendar/duration",
  checkPermissions("module"),
  // checkToken,
  httpUpdateDurationModule
);
modules.delete(
  "/:moduleId",
  checkPermissions("module"),
  // checkToken,
  httpDeleteModule
);
modules.use(
  "/new-module",
  checkPermissions("module"),
  // checkToken,
  putModuleImageRouter
);

// retourne la liste des modules assocués à un parcours
modules.get(
  "/:parcoursId",
  checkPermissions("module"),
  // checkToken,
  getModulesFromParcoursValidator,
  httpGetModulesFromParcours
);

export default modules;

import { Router } from "express";

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
import { createFileUploadMiddleware } from "../../../middleware/fileUpload";
import { headerImageMaxSize } from "../../../config/images-sizes";
import httpPutModuleParcours from "../../../controllers/parcours/http-put-module-parcours";
import httpPutModule from "../../../controllers/module/http-put-module";

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
modules.put(
  "/new-module",
  checkPermissions("module"),
  createFileUploadMiddleware(headerImageMaxSize),
  httpPutModuleParcours
);
modules.put(
  "/new-module/update",
  checkPermissions("module"),
  createFileUploadMiddleware(headerImageMaxSize),
  httpPutModule
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

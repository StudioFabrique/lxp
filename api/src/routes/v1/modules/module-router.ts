import { Router } from "express";

import httpGetModuleFormation from "../../../controllers/module/http-get-modules-formation";
import httpParcoursModules from "../../../controllers/module/http-parcours-modules";
import httpUpdateDatesModule from "../../../controllers/module/http-update-dates-module";
import httpUpdateDurationModule from "../../../controllers/module/http-update-duration-module";
import httpDeleteModule from "../../../controllers/module/http-delete-module";
import httpPutAddModule from "../../../controllers/parcours/http-put-add-module";
import {
  getModuleFormationValidator,
  getModulesFromParcoursValidator,
  moduleIdFromBodyValidator,
  moduleIdValidator,
  updateDurationValidator,
} from "./module-validators";
import checkPermissions from "../../../middleware/check-permissions";
import { createFileUploadMiddleware } from "../../../middleware/fileUpload";
import { headerImageMaxSize } from "../../../config/images-sizes";
import httpPutModuleParcours from "../../../controllers/parcours/http-put-module-parcours";
import httpPutModule from "../../../controllers/module/http-put-module";
import httpGetModulesFromParcours from "../../../controllers/module/http-get-modules-from-parcours";
import {
  parcoursIdValidator,
  updateDatesValidator,
} from "../parcours/parcours-validator";
import { idsArrayValidator } from "../../../helpers/custom-validators";
import httpGetAllModules from "../../../controllers/module/http-get-all-modules";
import httpDeleteFormationModule from "../../../controllers/module/http-delete-formation-module";

const modules = Router();

modules.put(
  "/add-module/:parcoursId/:moduleId",
  checkPermissions("module"),
  moduleIdValidator,
  parcoursIdValidator,
  httpPutAddModule
);
modules.get(
  "/formation/:formationId",
  checkPermissions("module"),
  getModuleFormationValidator,
  httpGetModuleFormation
);
modules.put(
  "/:parcoursId",
  checkPermissions("module"),
  parcoursIdValidator,
  idsArrayValidator,
  httpParcoursModules
);
modules.put(
  "/calendar/dates",
  checkPermissions("module"),
  moduleIdFromBodyValidator,
  updateDatesValidator,
  httpUpdateDatesModule
);
modules.put(
  "/calendar/duration",
  checkPermissions("module"),
  updateDurationValidator,
  httpUpdateDurationModule
);
modules.delete(
  "/:moduleId",
  checkPermissions("module"),
  moduleIdValidator,
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
  getModulesFromParcoursValidator,
  httpGetModulesFromParcours
);
// retourne la liste de tous les modules
modules.get("/", checkPermissions("module"), httpGetAllModules);
// supprime définitvement un module attaché à une formation
modules.delete(
  "/formation/:moduleId",
  checkPermissions("module"),
  httpDeleteFormationModule
);

export default modules;

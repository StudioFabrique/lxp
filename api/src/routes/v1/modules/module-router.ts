import { Router } from "express";

import httpGetModuleFormation from "../../../controllers/module/http-get-modules-formation.ts";
import httpParcoursModules from "../../../controllers/module/http-parcours-modules.ts";
import httpUpdateDatesModule from "../../../controllers/module/http-update-dates-module.ts";
import httpDeleteModule from "../../../controllers/module/http-delete-module.ts";
import {
  getModuleFormationValidator,
  getModulesFromParcoursValidator,
  moduleIdFromBodyValidator,
  moduleIdValidator,
  putModuleParcoursValidator,
  putModuleValidator,
  updateDatesModulesValidator,
} from "./module-validators.ts";
import checkPermissions from "../../../middleware/check-permissions.ts";
import checkContentAccess from "../../../middleware/check-content-access.ts";
import { createFileUploadMiddleware } from "../../../middleware/fileUpload.ts";
import { headerImageMaxSize } from "../../../config/images-sizes.ts";
import httpPutModuleParcours from "../../../controllers/parcours/http-put-module-parcours.ts";
import httpPutModule from "../../../controllers/module/http-put-module.ts";
import httpGetModulesFromParcours from "../../../controllers/module/http-get-modules-from-parcours.ts";
import { parcoursIdValidator } from "../parcours/parcours-validator.ts";
import { idsArrayValidator } from "../../../helpers/custom-validators.ts";
import httpGetAllModules from "../../../controllers/module/http-get-all-modules.ts";
import httpDeleteFormationModule from "../../../controllers/module/http-delete-formation-module.ts";
import httpGetModuleDetail from "../../../controllers/module/http-get-module-detail.ts";
import httpGetModuleImage from "../../../controllers/module/http-get-module-image.ts";
import jsonParser from "../../../middleware/json-parser.ts";
import httpGetLimitedModuleDetail from "../../../controllers/module/http-get-limited-module-detail.ts";
import httpPostDuplicateModule from "../../../controllers/module/http-post-duplicate-module.ts";
import httpGetParcoursModules from "../../../controllers/module/http-get-parcours-modules.ts";

const modules = Router();

modules.get(
  "/parcours-modules/:parcoursId",
  checkPermissions("module"),
  checkContentAccess("parcours", "parcoursId"),
  parcoursIdValidator,
  httpGetParcoursModules,
);

// retourne la liste de tous les modules
modules.get("/", checkPermissions("module"), httpGetAllModules);

modules.get(
  "/formation/:formationId/:duplicate",
  checkPermissions("module"),
  getModuleFormationValidator,
  httpGetModuleFormation,
);
modules.post(
  "/duplicate/:moduleId",
  checkPermissions("module"),
  httpPostDuplicateModule,
);
modules.put(
  "/calendar/dates",
  checkPermissions("module"),
  moduleIdFromBodyValidator,
  updateDatesModulesValidator,
  httpUpdateDatesModule,
);
modules.put(
  "/:parcoursId",
  checkPermissions("module"),
  checkContentAccess("parcours", "parcoursId"),
  parcoursIdValidator,
  idsArrayValidator,
  httpParcoursModules,
);
modules.delete(
  "/:moduleId",
  checkPermissions("module"),
  moduleIdValidator,
  httpDeleteModule,
);
modules.put(
  "/new-module",
  checkPermissions("module"),
  createFileUploadMiddleware(headerImageMaxSize),
  jsonParser,
  putModuleParcoursValidator,
  httpPutModuleParcours,
);
modules.put(
  "/new-module/update",
  checkPermissions("module"),
  createFileUploadMiddleware(headerImageMaxSize),
  jsonParser,
  putModuleValidator,
  httpPutModule,
);
// retourne la liste des modules associés à un parcours
modules.get(
  "/:parcoursId",
  checkPermissions("module"),
  checkContentAccess("parcours", "parcoursId"),
  getModulesFromParcoursValidator,
  httpGetModulesFromParcours,
);

// supprime définitivement un module attaché à une formation
modules.delete(
  "/formation/:moduleId",
  checkPermissions("module"),
  moduleIdValidator,
  httpDeleteFormationModule,
);

// retourne les détails d'un module pour les afficher dans l'interface de gestion des modules
modules.get(
  "/detail/:moduleId",
  checkPermissions("module"),
  checkContentAccess("module", "moduleId"),
  moduleIdValidator,
  httpGetModuleDetail,
);

modules.get(
  "/detail/limited/:moduleId",
  checkPermissions("module"),
  checkContentAccess("module", "moduleId"),
  moduleIdValidator,
  httpGetLimitedModuleDetail,
);

modules.get(
  "/image/:moduleId",
  checkPermissions("module"),
  checkContentAccess("module", "moduleId"),
  moduleIdValidator,
  httpGetModuleImage,
);

export default modules;

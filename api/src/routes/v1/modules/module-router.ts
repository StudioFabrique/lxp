import { Router } from "express";

import httpGetModuleFormation from "../../../controllers/module/http-get-modules-formation";
import httpParcoursModules from "../../../controllers/module/http-parcours-modules";
import httpUpdateDatesModule from "../../../controllers/module/http-update-dates-module";
import httpDeleteModule from "../../../controllers/module/http-delete-module";
import {
  getModuleFormationValidator,
  getModulesFromParcoursValidator,
  moduleIdFromBodyValidator,
  moduleIdValidator,
  postModuleMetadataValidator,
  putModuleParcoursValidator,
  putModuleValidator,
  updateDatesModulesValidator,
} from "./module-validators";
import checkPermissions from "../../../middleware/check-permissions";
import { createFileUploadMiddleware } from "../../../middleware/fileUpload";
import { headerImageMaxSize } from "../../../config/images-sizes";
import httpPutModuleParcours from "../../../controllers/parcours/http-put-module-parcours";
import httpPutModule from "../../../controllers/module/http-put-module";
import httpGetModulesFromParcours from "../../../controllers/module/http-get-modules-from-parcours";
import { parcoursIdValidator } from "../parcours/parcours-validator";
import { idsArrayValidator } from "../../../helpers/custom-validators";
import httpGetAllModules from "../../../controllers/module/http-get-all-modules";
import httpDeleteFormationModule from "../../../controllers/module/http-delete-formation-module";
import httpGetModuleDetail from "../../../controllers/module/http-get-module-detail";
import httpGetModuleImage from "../../../controllers/module/http-get-module-image";
import jsonParser from "../../../middleware/json-parser";
import httpGetLimitedModuleDetail from "../../../controllers/module/http-get-limited-module-detail";
import httpPostDuplicateModule from "../../../controllers/module/http-post-duplicate-module";
import httpGetParcoursModules from "../../../controllers/module/http-get-parcours-modules";
import httpPostModuleMetadata from "../../../controllers/module/http-post-module-metadata";

const modules = Router();

modules.post(
  "/metadata",
  checkPermissions("module"),
  postModuleMetadataValidator,
  httpPostModuleMetadata,
);

modules.get(
  "/parcours-modules/:parcoursId",
  checkPermissions("module"),
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
  moduleIdValidator,
  httpGetModuleDetail,
);

modules.get(
  "/detail/limited/:moduleId",
  checkPermissions("module"),
  moduleIdValidator,
  httpGetLimitedModuleDetail,
);

modules.get(
  "/image/:moduleId",
  checkPermissions("module"),
  moduleIdValidator,
  httpGetModuleImage,
);

export default modules;

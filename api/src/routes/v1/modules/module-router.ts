import { Router } from "express";
import path from "path";

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
  postModuleFromScratchValidator,
  putModuleParcoursValidator,
  putModuleValidator,
  updateDatesModulesValidator,
  updateDurationValidator,
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
import httpGetModulesTimeline from "../../../controllers/module/http-get-modules-timeline";
import httpGetModuleImage from "../../../controllers/module/http-get-module-image";
import { checkValidatorResult } from "../../../middleware/validators";
import { query } from "express-validator";
import jsonParser from "../../../middleware/json-parser";
import multer from "multer";
import httpPostModuleFromScratch from "../../../controllers/module/http-post-module-from-scratch";
import httpGetLimitedModuleDetail from "../../../controllers/module/http-get-limited-module-detail";

const modules = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "..", "..", "uploads"));
  },
  filename: function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      const newFileName =
        Date.now() + "-" + Math.round(Math.random() * 1e9) + file.originalname;
      cb(null, file.fieldname + "-" + newFileName);
    } else {
      return;
    }
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 } });

// retourne la liste de tous les modules
modules.get("/", checkPermissions("module"), httpGetAllModules);

modules.get(
  "/timeline",
  checkPermissions("module"),
  [
    query("minDate")
      .exists()
      .withMessage("minDate est requis")
      .custom((value) => {
        try {
          if (!(value instanceof Date) && !isNaN(new Date(value).getTime())) {
            return true;
          }
          return false;
        } catch (e) {
          return false;
        }
      })
      .withMessage("minDate doit être une date de format ISO 8601"),

    query("maxDate")
      .exists()
      .withMessage("maxDate est requis")
      .custom((value) => {
        try {
          if (!(value instanceof Date) && !isNaN(new Date(value).getTime())) {
            return true;
          }
          return false;
        } catch (e) {
          return false;
        }
      })
      .withMessage("maxDate doit être une date de format ISO 8601")
      .custom((maxDate, { req }) => {
        const minDate = req.query?.minDate;
        if (new Date(maxDate) <= new Date(minDate)) {
          throw new Error("maxDate doit être plus grand que minDate");
        }
        return true;
      }),
    checkValidatorResult,
  ],
  httpGetModulesTimeline
);

modules.put(
  "/add-module/:parcoursId/:moduleId",
  checkPermissions("module"),
  moduleIdValidator,
  parcoursIdValidator,
  httpPutAddModule
);
modules.get(
  "/formation/:formationId/:duplicate",
  checkPermissions("module"),
  getModuleFormationValidator,
  httpGetModuleFormation
);

modules.put(
  "/calendar/dates",
  checkPermissions("module"),
  moduleIdFromBodyValidator,
  updateDatesModulesValidator,
  httpUpdateDatesModule
);
modules.put(
  "/calendar/duration",
  checkPermissions("module"),
  updateDurationValidator,
  httpUpdateDurationModule
);
modules.put(
  "/:parcoursId",
  checkPermissions("module"),
  parcoursIdValidator,
  idsArrayValidator,
  httpParcoursModules
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
  jsonParser,
  putModuleParcoursValidator,
  httpPutModuleParcours
);
modules.put(
  "/new-module/update",
  checkPermissions("module"),
  putModuleValidator,
  httpPutModule
);
// retourne la liste des modules assocués à un parcours
modules.get(
  "/:parcoursId",
  checkPermissions("module"),
  getModulesFromParcoursValidator,
  httpGetModulesFromParcours
);

// supprime définitvement un module attaché à une formation
modules.delete(
  "/formation/:moduleId",
  checkPermissions("module"),
  moduleIdValidator,
  httpDeleteFormationModule
);

// retourne les détails d'un module pour les afficher dans l'interface de gestion des modules
modules.get(
  "/detail/:moduleId",
  checkPermissions("module"),
  moduleIdValidator,
  httpGetModuleDetail
);

modules.get(
  "/detail/limited/:moduleId",
  checkPermissions("module"),
  moduleIdValidator,
  httpGetLimitedModuleDetail
);

modules.get(
  "/image/:moduleId",
  checkPermissions("module"),
  moduleIdValidator,
  httpGetModuleImage
);

modules.post(
  "/new-module",
  checkPermissions("module"),
  upload.single("image"),
  jsonParser,
  postModuleFromScratchValidator,
  httpPostModuleFromScratch
);

modules.delete(
  "/parcours/:moduleId",
  checkPermissions("module"),
  moduleIdValidator,
  httpDeleteModule
);

export default modules;

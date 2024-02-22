import express from "express";
import { body } from "express-validator";

import httpGetParcours from "../../../controllers/parcours/http-get-parcours";
import httpDeleteParcoursById from "../../../controllers/parcours/http-delete-parcours-by-id";
import httpCreateParcours from "../../../controllers/parcours/http-create-parcours";
import httpPutVirtualClass from "../../../controllers/parcours/http-put-virtual-class";
import httpPutParcoursObjectives from "../../../controllers/parcours/http-put-parcours-objectives";
import httpPutReorderObjectives from "../../../controllers/parcours/http-put-reorder-objectives";
import {
  getParcoursByFormationValidator,
  parcoursByIdValidator,
  parcoursIdValidator,
  postParcoursValidator,
  putParcoursContactsValidator,
  putParcoursTagsValidator,
  updateDatesValidator,
  updateInfosValidator,
  virtualClassValidator,
} from "./parcours-validator";
import httpGetParcoursByFormation from "../../../controllers/parcours/http-get-parcours-by-formation";
import httpGetParcoursById from "../../../controllers/parcours/http-get-parcours-by-id";
import httpUpdateParcoursInfos from "../../../controllers/parcours/http-update-parcours-infos";
import httpUpdateParcoursDates from "../../../controllers/parcours/http-update-parcours-dates";
import httpPutParcoursTags from "../../../controllers/parcours/http-put-parcours-tags";
import httpPutParcoursContacts from "../../../controllers/parcours/http-put-parcours-contacts";
import httpPutParcoursGroups from "../../../controllers/parcours/http-put-parcours-groups";
import httpPublishParcours from "../../../controllers/parcours/http-publish-parcours";
import checkPermissions from "../../../middleware/check-permissions";
import { createFileUploadMiddleware } from "../../../middleware/fileUpload";
import httpUpdateImage from "../../../controllers/parcours/http-update-image";
import { headerImageMaxSize } from "../../../config/images-sizes";
import httpGetTeacherParcours from "../../../controllers/parcours/http-get-teacher-parcours";
import httpGetRootAdminParcours from "../../../controllers/parcours/http-get-root-admin-parcours";

const parcoursRouter = express.Router();
parcoursRouter.get("/", checkPermissions("parcours"), httpGetParcours);
parcoursRouter.post(
  "/",
  checkPermissions("parcours"),
  postParcoursValidator,
  httpCreateParcours
);
parcoursRouter.delete(
  "/:parcoursId",
  checkPermissions("parcours"),
  parcoursByIdValidator,
  httpDeleteParcoursById
);
parcoursRouter.get(
  "/parcours-by-formation/:formationId",
  checkPermissions("parcours"),
  getParcoursByFormationValidator,
  httpGetParcoursByFormation
);
parcoursRouter.get(
  "/parcours-by-id/:parcoursId",
  checkPermissions("parcours"),
  parcoursByIdValidator,
  httpGetParcoursById
);
parcoursRouter.get(
  "/parcours-as-student",
  checkPermissions("default"),
  httpGetParcours
);
parcoursRouter.put(
  "/update-infos",
  checkPermissions("parcours"),
  updateInfosValidator,
  httpUpdateParcoursInfos
);
parcoursRouter.put(
  "/update-dates",
  checkPermissions("parcours"),
  updateDatesValidator,
  httpUpdateParcoursDates
);
parcoursRouter.put(
  "/update-tags",
  checkPermissions("parcours"),
  putParcoursTagsValidator,
  httpPutParcoursTags
);
parcoursRouter.put(
  "/update-contacts",
  checkPermissions("parcours"),
  putParcoursContactsValidator,
  httpPutParcoursContacts
);
//parcoursRouter.use("/update-skills", putParcoursSkillsRouter);
parcoursRouter.put(
  "/update-virtual-class",
  checkPermissions("parcours"),
  virtualClassValidator,
  httpPutVirtualClass
);
parcoursRouter.put(
  "/update-objectives",
  checkPermissions("parcours"),
  body("parcoursId").isNumeric().notEmpty().escape(),
  body("objectives").isArray().notEmpty(),
  body("objectives.*").isString().notEmpty(),
  httpPutParcoursObjectives
);
parcoursRouter.put(
  "/reorder-objectives",
  checkPermissions("parcours"),
  httpPutReorderObjectives
);
parcoursRouter.put(
  "/update-image/:parcoursId",
  checkPermissions("parcours"),
  createFileUploadMiddleware(headerImageMaxSize),
  parcoursIdValidator,
  httpUpdateImage
);
parcoursRouter.put(
  "/groups",
  checkPermissions("parcours"),
  httpPutParcoursGroups
);
parcoursRouter.put(
  "/publish/:parcoursId",
  checkPermissions("parcours"),
  httpPublishParcours
);
// retourne la liste des trois derniers parcours enregistrés
parcoursRouter.get(
  "/root-parcours",
  checkPermissions("parcours"),
  httpGetRootAdminParcours
);
// retourne la liste des parcours auquel le formateur connecté est associé en tant que contact pour la vue home parcours
parcoursRouter.get(
  "/teacher-parcours",
  checkPermissions("parcours"),
  httpGetTeacherParcours
);

export default parcoursRouter;

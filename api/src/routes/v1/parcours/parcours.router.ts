// Import des modules nécessaires
import express from "express";
import { body } from "express-validator";

// Import des contrôleurs pour la gestion des parcours
import httpGetParcours from "../../../controllers/parcours/http-get-parcours.ts";
import httpDeleteParcoursById from "../../../controllers/parcours/http-delete-parcours-by-id.ts";
import httpCreateParcours from "../../../controllers/parcours/http-create-parcours.ts";
import httpPutVirtualClass from "../../../controllers/parcours/http-put-virtual-class.ts";
import httpPutParcoursObjectives from "../../../controllers/parcours/http-put-parcours-objectives.ts";
import httpPutReorderObjectives from "../../../controllers/parcours/http-put-reorder-objectives.ts";
import {
  getParcoursByFormationValidator,
  getParcoursSelectValidator,
  parcoursByIdValidator,
  parcoursIdValidator,
  postParcoursValidator,
  patchParcoursValidator,
  putParcoursContactsValidator,
  putParcoursTagsValidator,
  updateDatesValidator,
  updateInfosValidator,
  virtualClassValidator,
} from "./parcours-validator.ts";
import httpGetParcoursByFormation from "../../../controllers/parcours/http-get-parcours-by-formation.ts";
import httpGetParcoursById from "../../../controllers/parcours/http-get-parcours-by-id.ts";
import httpUpdateParcoursInfos from "../../../controllers/parcours/http-update-parcours-infos.ts";
import httpUpdateParcoursDates from "../../../controllers/parcours/http-update-parcours-dates.ts";
import httpPutParcoursTags from "../../../controllers/parcours/http-put-parcours-tags.ts";
import httpPutParcoursContacts from "../../../controllers/parcours/http-put-parcours-contacts.ts";
import httpPutParcoursGroups from "../../../controllers/parcours/http-put-parcours-groups.ts";
import httpPublishParcours from "../../../controllers/parcours/http-publish-parcours.ts";
import checkPermissions from "../../../middleware/check-permissions.ts";
import { createFileUploadMiddleware } from "../../../middleware/fileUpload.ts";
import httpUpdateImage from "../../../controllers/parcours/http-update-image.ts";
import { headerImageMaxSize } from "../../../config/images-sizes.ts";
import httpGetRootAdminParcours from "../../../controllers/parcours/http-get-root-admin-parcours.ts";
import httpGetParcoursAsStudent from "../../../controllers/parcours/http-get-parcours-as-student.ts";
import httpGetSelectParcours from "../../../controllers/parcours/http-get-select-parcours.ts";
import httpPostDuplicateParcours from "../../../controllers/parcours/http-post-duplicate-parcours.ts";
import httpGetParcoursSkillsContacts from "../../../controllers/parcours/http-get-parcours-skills-contacts.ts";
import httpPatchParcours from "../../../controllers/parcours/http-patch-parcours.ts";

// Création du routeur Express pour les parcours
const parcoursRouter = express.Router();

// Route GET pour récupérer la liste complète des parcours
parcoursRouter.get("/", checkPermissions("parcours"), httpGetParcours);

// Route GET pour récupérer une liste simplifiée des parcours
parcoursRouter.get(
  "/select/:formationId?",
  checkPermissions("parcours"),
  getParcoursSelectValidator,
  httpGetSelectParcours
);

// Route POST pour créer un nouveau parcours
parcoursRouter.post(
  "/",
  checkPermissions("parcours"),
  postParcoursValidator,
  httpCreateParcours
);

// Endpoint unifié, introduit progressivement en remplacement des routes PUT granulaires.
parcoursRouter.patch(
  "/:parcoursId",
  checkPermissions("parcours"),
  patchParcoursValidator,
  httpPatchParcours,
);

// Route DELETE pour supprimer un parcours spécifique
parcoursRouter.delete(
  "/:parcoursId",
  checkPermissions("parcours"),
  parcoursByIdValidator,
  httpDeleteParcoursById
);

// Route GET pour récupérer les parcours associés à une formation
parcoursRouter.get(
  "/parcours-by-formation/:formationId",
  checkPermissions("parcours"),
  getParcoursByFormationValidator,
  httpGetParcoursByFormation
);

// Route GET pour récupérer les détails d'un parcours spécifique
parcoursRouter.get(
  "/parcours-by-id/:parcoursId",
  checkPermissions("parcours"),
  parcoursByIdValidator,
  httpGetParcoursById
);

// Route GET pour récupérer les parcours d'un étudiant
parcoursRouter.get(
  "/parcours-as-student",
  checkPermissions("cursus"),
  httpGetParcoursAsStudent
);

// Route PUT pour mettre à jour les informations générales d'un parcours
parcoursRouter.put(
  "/update-infos",
  checkPermissions("parcours"),
  updateInfosValidator,
  httpUpdateParcoursInfos
);

// Route PUT pour mettre à jour les dates d'un parcours
parcoursRouter.put(
  "/update-dates",
  checkPermissions("parcours"),
  updateDatesValidator,
  httpUpdateParcoursDates
);

// Route PUT pour mettre à jour les tags d'un parcours
parcoursRouter.put(
  "/update-tags",
  checkPermissions("parcours"),
  putParcoursTagsValidator,
  httpPutParcoursTags
);

// Route PUT pour mettre à jour les contacts d'un parcours
parcoursRouter.put(
  "/update-contacts",
  checkPermissions("parcours"),
  putParcoursContactsValidator,
  httpPutParcoursContacts
);

// Route PUT pour mettre à jour la classe virtuelle d'un parcours
parcoursRouter.put(
  "/update-virtual-class",
  checkPermissions("parcours"),
  virtualClassValidator,
  httpPutVirtualClass
);

// Route PUT pour mettre à jour les objectifs d'un parcours
parcoursRouter.put(
  "/update-objectives",
  checkPermissions("parcours"),
  body("parcoursId").isNumeric().notEmpty().escape(),
  body("objectives").isArray().notEmpty(),
  body("objectives.*").isString().notEmpty(),
  httpPutParcoursObjectives
);

// Route PUT pour réorganiser les objectifs d'un parcours
parcoursRouter.put(
  "/reorder-objectives",
  checkPermissions("parcours"),
  httpPutReorderObjectives
);

// Route PUT pour mettre à jour l'image d'un parcours
parcoursRouter.put(
  "/update-image/:parcoursId",
  checkPermissions("parcours"),
  createFileUploadMiddleware(headerImageMaxSize),
  parcoursIdValidator,
  httpUpdateImage
);

// Route PUT pour mettre à jour les groupes d'un parcours
parcoursRouter.put(
  "/groups",
  checkPermissions("parcours"),
  httpPutParcoursGroups
);

// Route PUT pour publier un parcours
parcoursRouter.put(
  "/publish/:parcoursId",
  checkPermissions("parcours"),
  httpPublishParcours
);

// Route GET pour récupérer jusqu'à six formations avec leurs derniers parcours
parcoursRouter.get(
  "/root-parcours",
  checkPermissions("parcours"),
  httpGetRootAdminParcours
);

// Route POST pour dupliquer un parcours existant
parcoursRouter.post(
  "/duplicate/:parcoursId",
  checkPermissions("parcours"),
  parcoursIdValidator,
  httpPostDuplicateParcours
);

// Route GET pour récupérer les contacts et compétences d'un parcours
parcoursRouter.get(
  "/skills-contacts/:parcoursId",
  checkPermissions("parcours"),
  parcoursIdValidator,
  httpGetParcoursSkillsContacts
);

export default parcoursRouter;

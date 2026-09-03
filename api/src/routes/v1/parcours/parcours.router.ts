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
import checkContentAccess from "../../../middleware/check-content-access.ts";
import checkFormationAccess from "../../../middleware/check-formation-access.ts";
import httpExportParcours from "../../../controllers/parcours/http-export-parcours.ts";
import httpImportParcours from "../../../controllers/parcours/http-import-parcours.ts";
import uploadParcoursArchive from "../../../middleware/upload-parcours-archive.ts";
import checkRoleRank from "../../../middleware/check-role-rank.ts";
import { checkValidatorResult } from "../../../middleware/validators.ts";
import { checkGroupAccess } from "../../../middleware/check-group-access.ts";

// Création du routeur Express pour les parcours
const parcoursRouter = express.Router();

// Route GET pour récupérer la liste complète des parcours
parcoursRouter.get("/", checkPermissions("parcours"), httpGetParcours);

parcoursRouter.get(
  "/export/:parcoursId",
  checkPermissions("parcours", "read"),
  checkRoleRank([0, 1]),
  checkContentAccess("parcours", "parcoursId"),
  parcoursIdValidator,
  httpExportParcours,
);

parcoursRouter.post(
  "/import",
  checkPermissions("parcours", "write"),
  checkRoleRank([0, 1]),
  uploadParcoursArchive,
  httpImportParcours,
);

// Route GET pour récupérer une liste simplifiée des parcours
parcoursRouter.get(
  "/select/:formationId?",
  checkPermissions("parcours"),
  getParcoursSelectValidator,
  httpGetSelectParcours,
);

// Route POST pour créer un nouveau parcours
parcoursRouter.post(
  "/",
  checkPermissions("parcours"),
  postParcoursValidator,
  checkFormationAccess("formation"),
  httpCreateParcours,
);

// Endpoint unifié, introduit progressivement en remplacement des routes PUT granulaires.
parcoursRouter.patch(
  "/:parcoursId",
  checkPermissions("parcours"),
  checkContentAccess("parcours", "parcoursId"),
  patchParcoursValidator,
  httpPatchParcours,
);

// Route DELETE pour supprimer un parcours spécifique
parcoursRouter.delete(
  "/:parcoursId",
  checkPermissions("parcours", "delete"),
  checkRoleRank([0, 1]),
  checkContentAccess("parcours", "parcoursId"),
  parcoursByIdValidator,
  httpDeleteParcoursById,
);

// Route GET pour récupérer les parcours associés à une formation
parcoursRouter.get(
  "/parcours-by-formation/:formationId",
  checkPermissions("parcours"),
  getParcoursByFormationValidator,
  httpGetParcoursByFormation,
);

// Route GET pour récupérer les détails d'un parcours spécifique
parcoursRouter.get(
  "/parcours-by-id/:parcoursId",
  checkPermissions("parcours"),
  checkContentAccess("parcours", "parcoursId"),
  parcoursByIdValidator,
  httpGetParcoursById,
);

// Route GET pour récupérer les parcours d'un étudiant
parcoursRouter.get(
  "/parcours-as-student",
  checkPermissions("cursus"),
  httpGetParcoursAsStudent,
);

// Route PUT pour mettre à jour les informations générales d'un parcours
parcoursRouter.put(
  "/update-infos",
  checkPermissions("parcours"),
  checkContentAccess("parcours", "parcoursId"),
  updateInfosValidator,
  httpUpdateParcoursInfos,
);

// Route PUT pour mettre à jour les dates d'un parcours
parcoursRouter.put(
  "/update-dates",
  checkPermissions("parcours"),
  checkContentAccess("parcours", "parcoursId"),
  updateDatesValidator,
  httpUpdateParcoursDates,
);

// Route PUT pour mettre à jour les tags d'un parcours
parcoursRouter.put(
  "/update-tags",
  checkPermissions("parcours"),
  checkContentAccess("parcours", "parcoursId"),
  putParcoursTagsValidator,
  httpPutParcoursTags,
);

// Route PUT pour mettre à jour les contacts d'un parcours
parcoursRouter.put(
  "/update-contacts",
  checkPermissions("parcours"),
  checkContentAccess("parcours", "parcoursId"),
  putParcoursContactsValidator,
  httpPutParcoursContacts,
);

// Route PUT pour mettre à jour la classe virtuelle d'un parcours
parcoursRouter.put(
  "/update-virtual-class",
  checkPermissions("parcours"),
  checkContentAccess("parcours", "parcoursId"),
  virtualClassValidator,
  httpPutVirtualClass,
);

// Route PUT pour mettre à jour les objectifs d'un parcours
parcoursRouter.put(
  "/update-objectives",
  checkPermissions("parcours"),
  checkContentAccess("parcours", "parcoursId"),
  body("parcoursId").isNumeric().notEmpty().escape(),
  body("objectives").isArray().notEmpty(),
  body("objectives.*").isString().notEmpty(),
  httpPutParcoursObjectives,
);

// Route PUT pour réorganiser les objectifs d'un parcours
parcoursRouter.put(
  "/reorder-objectives",
  checkPermissions("parcours"),
  checkContentAccess("parcours", "parcoursId"),
  httpPutReorderObjectives,
);

// Route PUT pour mettre à jour l'image d'un parcours
parcoursRouter.put(
  "/update-image/:parcoursId",
  checkPermissions("parcours"),
  checkContentAccess("parcours", "parcoursId"),
  createFileUploadMiddleware(headerImageMaxSize),
  parcoursIdValidator,
  httpUpdateImage,
);

// Route PUT pour mettre à jour les groupes d'un parcours
parcoursRouter.put(
  "/groups",
  checkPermissions("parcours"),
  [
    body("parcoursId").isInt({ min: 1 }).withMessage("ID de parcours invalide"),
    body("groupsIds").isArray({ max: 500 }),
    body("groupsIds.*").isMongoId().withMessage("ID de groupe invalide"),
    checkValidatorResult,
  ],
  checkContentAccess("parcours", "parcoursId"),
  checkGroupAccess({ location: "body", key: "groupsIds", allowEmpty: true }),
  httpPutParcoursGroups,
);

// Route PUT pour publier un parcours
parcoursRouter.put(
  "/publish/:parcoursId",
  checkPermissions("parcours"),
  checkContentAccess("parcours", "parcoursId"),
  httpPublishParcours,
);

// Route GET pour récupérer les formations avec tous leurs parcours
parcoursRouter.get(
  "/root-parcours",
  checkPermissions("parcours"),
  httpGetRootAdminParcours,
);

// Route POST pour dupliquer un parcours existant
parcoursRouter.post(
  "/duplicate/:parcoursId",
  checkPermissions("parcours"),
  checkContentAccess("parcours", "parcoursId"),
  parcoursIdValidator,
  httpPostDuplicateParcours,
);

// Route GET pour récupérer les contacts et compétences d'un parcours
parcoursRouter.get(
  "/skills-contacts/:parcoursId",
  checkPermissions("parcours"),
  checkContentAccess("parcours", "parcoursId"),
  parcoursIdValidator,
  httpGetParcoursSkillsContacts,
);

export default parcoursRouter;

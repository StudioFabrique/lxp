import { Router } from "express";
import httpCreateGroup from "../../controllers/group/http-create-group";
import httpGetAllGroups from "../../controllers/group/http-get-all-groups";
import {
  checkValidatorResult,
  getAllValidator,
  groupValidator,
  searchValidator,
} from "../../middleware/validators";
import httpSearchGroup from "../../controllers/group/http-search-group";
import checkPermissions from "../../middleware/check-permissions";
import { createFileUploadMiddleware } from "../../middleware/fileUpload";
import { headerImageMaxSize } from "../../config/images-sizes";
import jsonParser from "../../middleware/json-parser";
import httpDeleteGroup from "../../controllers/group/http-delete-group";
import httpDeleteUserFromGroup from "../../controllers/group/http-delete-user-from-group";
import httpGetGroupDetails from "../../controllers/group/http-get-group-details";
import httpPutGroup from "../../controllers/group/http-put-group";
import httpPutAddUsersGroup from "../../controllers/group/http-put-add-users-group";
import httpDeleteManyGroups from "../../controllers/group/http-delete-many-groups";
import { body, param, query } from "express-validator";
import { regexStringManyMongoId } from "../../utils/constantes";
import httpGetStudentGroups from "../../controllers/group/http-get-student-groups";
const groupRouter = Router();

// Retourne la liste des groupes d'étudiants avec des informations minimales destinées à être affichées dans un tableau
groupRouter.get("/student", checkPermissions("group"), httpGetStudentGroups);

// GET routes
// search/student/sasdfa/name/asc
// search/student/test/name/desc?page=1&limit=5
// search/:role/:entity/:value/:stype/:sdir
groupRouter.get(
  "/search/:role/:entity/:value/:stype/:sdir",
  checkPermissions(),
  searchValidator,
  httpSearchGroup
);

groupRouter.get(
  "/:role/:stype/:sdir",
  checkPermissions(),
  getAllValidator,
  httpGetAllGroups
);

groupRouter.get(
  "/:id",
  checkPermissions("group"),
  param("id").isMongoId().withMessage("ID de groupe invalide"),
  httpGetGroupDetails
);

// POST routes
groupRouter.post(
  "/",
  checkPermissions("group"),
  createFileUploadMiddleware(headerImageMaxSize),
  jsonParser,
  groupValidator,
  httpCreateGroup
);

// PUT routes
groupRouter.put(
  "/addUsers/:id",
  checkPermissions("group"),
  jsonParser,
  [
    param("id").isMongoId().withMessage("ID de groupe invalide"),
    body("usersId")
      .isArray()
      .withMessage("Le tableau d'identifiants utilisateurs est requis"),
    body("usersId.*").isMongoId().withMessage("ID d'utilisateur invalide"),
    checkValidatorResult,
  ],
  httpPutAddUsersGroup
);

groupRouter.put(
  "/:id",
  checkPermissions("group"),
  createFileUploadMiddleware(headerImageMaxSize),
  jsonParser,
  groupValidator,
  httpPutGroup
);

// DELETE routes
groupRouter.delete(
  "/user/:groupId/:userId",
  checkPermissions("group"),
  [
    param("groupId").isMongoId().withMessage("ID de groupe invalide"),
    param("userId").isMongoId().withMessage("ID d'utilisateur invalide"),
    checkValidatorResult,
  ],
  httpDeleteUserFromGroup
);

groupRouter.delete(
  "/deleteMany",
  checkPermissions("group"),
  [
    query("ids").isMongoId().withMessage("IDs de groupes invalides"),
    checkValidatorResult,
  ],
  httpDeleteManyGroups
);

groupRouter.delete(
  "/:id",
  checkPermissions("group"),
  [
    param("id")
      .matches(regexStringManyMongoId)
      .withMessage("ID d'utilisateur invalide - format incorrect"),
    checkValidatorResult,
  ],
  httpDeleteGroup
);

export default groupRouter;

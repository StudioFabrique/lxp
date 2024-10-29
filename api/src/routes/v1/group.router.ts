import { Router } from "express";
import httpCreateGroup from "../../controllers/group/http-create-group";
import httpGetAllGroups from "../../controllers/group/http-get-all-groups";
import {
  getAllValidator,
  groupPutValidator,
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
const groupRouter = Router();

// GET routes
groupRouter.get(
  "/search/:role/:entity/:value/:stype/:sdir",
  checkPermissions(),
  searchValidator,
  httpSearchGroup,
);

groupRouter.get(
  "/:role/:stype/:sdir",
  checkPermissions(),
  getAllValidator,
  httpGetAllGroups,
);

groupRouter.get("/:id", checkPermissions("group"), httpGetGroupDetails);

// POST routes
groupRouter.post(
  "/",
  checkPermissions("group"),
  createFileUploadMiddleware(headerImageMaxSize),
  jsonParser,
  groupValidator,
  httpCreateGroup,
);

// PUT routes
groupRouter.put(
  "/addUsers/:id",
  checkPermissions("group"),
  httpPutAddUsersGroup,
);

groupRouter.put(
  "/:id",
  checkPermissions("group"),
  createFileUploadMiddleware(headerImageMaxSize),
  jsonParser,
  groupPutValidator,
  httpPutGroup,
);

// DELETE routes
groupRouter.delete(
  "/user/:groupId/:userId",
  checkPermissions("group"),
  httpDeleteUserFromGroup,
);

groupRouter.delete(
  "/deleteMany",
  checkPermissions("group"),
  httpDeleteManyGroups,
);

groupRouter.delete("/:id", checkPermissions("group"), httpDeleteGroup);

export default groupRouter;

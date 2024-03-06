import { Router } from "express";
import httpCreateGroup from "../../controllers/group/http-create-group";
import httpGetAllGroups from "../../controllers/group/http-get-all-groups";
import {
  getAllValidator,
  groupValidator,
  searchValidator,
} from "../../middleware/validators";
import httpSearchGroup from "../../controllers/group/http-search-group";
import checkPermissions from "../../middleware/check-permissions";
import { createFileUploadMiddleware } from "../../middleware/fileUpload";
import { headerImageMaxSize } from "../../config/images-sizes";
import jsonParser from "../../middleware/json-parser";
import httpPutGroupUsers from "../../controllers/group/http-put-group-users";
import httpDeleteGroup from "../../controllers/group/http-delete-group";
import httpDeleteUserFromGroup from "../../controllers/group/http-delete-user-from-group";
import httpGetGroupDetails from "../../controllers/group/http-get-group-details";
const groupRouter = Router();

groupRouter.get("/:id", checkPermissions("group"), httpGetGroupDetails);

groupRouter.get(
  "/:role/:stype/:sdir",
  checkPermissions(),
  getAllValidator,
  httpGetAllGroups
);

groupRouter.get(
  "/search/:role/:entity/:value/:stype/:sdir",
  checkPermissions(),
  searchValidator,
  httpSearchGroup
);

groupRouter.put("/:id" /* ,validator */, httpPutGroupUsers);

groupRouter.post(
  "/",
  checkPermissions("group"),
  createFileUploadMiddleware(headerImageMaxSize),
  jsonParser,
  groupValidator,
  httpCreateGroup
);

groupRouter.delete("/:id", checkPermissions("group"), httpDeleteGroup);

groupRouter.delete(
  "/user/:groupId/:userId",
  checkPermissions("group"),
  httpDeleteUserFromGroup
);

export default groupRouter;

import { Router } from "express";
import checkPermissions from "../../../middleware/check-permissions";
import httpGetPermissions from "../../../controllers/permission/http-get-permissions";
import { getPermissionsValidator } from "./permission-validators";
import checkToken from "../../../middleware/check-token";

const permissionRouter = Router();

permissionRouter.get(
  "/:role",
  checkToken,
  getPermissionsValidator,
  httpGetPermissions
);

export default permissionRouter;

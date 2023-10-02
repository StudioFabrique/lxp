import { Router } from "express";
import checkPermissions from "../../../middleware/check-permissions";
import httpGetPermissions from "../../../controllers/permission/http-get-permissions";
import { getPermissionsValidator } from "./permission-validators";

const permissionRouter = Router();

permissionRouter.get(
  "/:role",
  checkPermissions(1, "read", "permission"),
  getPermissionsValidator,
  httpGetPermissions
);

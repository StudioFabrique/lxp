import { Router } from "express";
import checkPermissions from "../../../middleware/check-permissions";
import httpGetPermissions from "../../../controllers/permission/http-get-permissions";
import checkToken from "../../../middleware/check-token";
import httpGetRoles from "../../../controllers/permission/http-get-roles";
import httpDeleteRole from "../../../controllers/permission/http-delete-role";
import httpPostRole from "../../../controllers/permission/http-post-role";
import {
  deleteRoleValidator,
  getPermissionsValidator,
  postRoleValidator,
} from "./permission-validators";

const permissionRouter = Router();

// Obtenir la liste des permissions associées à un rôle
permissionRouter.get(
  "/:role",
  checkToken,
  getPermissionsValidator,
  httpGetPermissions
);

// Obtenir la liste des rôles existants avec le nombre de permissions associés à chaque type d'actions (crud)
permissionRouter.get("/", checkPermissions("role"), httpGetRoles);

permissionRouter.post(
  "/role/",
  checkPermissions("role"),
  postRoleValidator,
  httpPostRole
);

permissionRouter.delete(
  "/role/:role",
  checkPermissions("role"),
  deleteRoleValidator,
  httpDeleteRole
);

export default permissionRouter;

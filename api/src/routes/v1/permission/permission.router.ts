import { Router } from "express";
import checkPermissions from "../../../middleware/check-permissions";
import httpGetPermissions from "../../../controllers/permission/http-get-permissions";
import { permissionsValidator } from "./permission-validators";
import checkToken from "../../../middleware/check-token";
import httpGetRoles from "../../../controllers/permission/http-get-roles";
import httpDeleteRole from "../../../controllers/permission/http-delete-role";

const permissionRouter = Router();

// Obtenir la liste des permissions associées à un rôle
permissionRouter.get(
  "/:role",
  checkToken,
  permissionsValidator,
  httpGetPermissions
);

// Obtenir la liste des rôles existants
permissionRouter.get("/", checkPermissions("role"), httpGetRoles);

permissionRouter.delete(
  "/role/:role",
  checkPermissions("role"),
  permissionsValidator,
  httpDeleteRole
);

export default permissionRouter;

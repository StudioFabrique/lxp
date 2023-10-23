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
  putRoleValidator,
} from "./permission-validators";
import httpPutRole from "../../../controllers/permission/http-put-role";
import httpGetRessources from "../../../controllers/permission/http-get-ressources";

const permissionRouter = Router();

/**
 * Obtenir la liste de toute les ressources existantes
 * (renvoi un tableau combinant le nom de tous les rôles ainsi que toutes les ressources defs)
 **/
permissionRouter.get(
  "/ressources",
  checkPermissions("role"),
  httpGetRessources
);

// Obtenir la liste des rôles existants avec le nombre de permissions associés à chaque type d'actions (crud)
permissionRouter.get("/", checkPermissions("role"), httpGetRoles);

// Obtenir la liste des permissions associées à un rôle
permissionRouter.get(
  "/:role",
  checkToken,
  getPermissionsValidator,
  httpGetPermissions
);

// Créer un rôle ou copier un rôle avec ses permissions
permissionRouter.post(
  "/role",
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

// Modifier le nom du rôle ou/et modifier les permissions
permissionRouter.put(
  "/role/:id",
  checkPermissions("role"),
  putRoleValidator,
  httpPutRole
);

export default permissionRouter;

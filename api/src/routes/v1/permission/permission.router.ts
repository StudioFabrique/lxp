import { Router } from "express";
import checkPermissions from "../../../middleware/check-permissions";
import httpGetPermissions from "../../../controllers/permission/http-get-permissions";
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
import httpGetSearchRoles from "../../../controllers/permission/http-get-search-roles";

const permissionRouter = Router();

// Obtenir la liste des rôles existants avec le nombre de permissions associés à chaque type d'actions (crud)
permissionRouter.get("/role", checkPermissions("role"), httpGetRoles);

// Recherche de rôles
permissionRouter.get(
  "/role/search/:searchValue",
  checkPermissions("role"),
  httpGetSearchRoles,
);

/**
 * Obtenir la liste de toute les ressources existantes
 * (renvoi un tableau combinant le nom de tous les rôles ainsi que toutes les ressources defs)
 **/
permissionRouter.get(
  "/ressources/:role",
  checkPermissions("role"),
  getPermissionsValidator,
  httpGetRessources,
);

// Obtenir la liste des permissions associées à un rôle
permissionRouter.get(
  "/:role",
  checkPermissions("role"),
  getPermissionsValidator,
  httpGetPermissions,
);

// Créer un rôle ou copier un rôle avec ses permissions
permissionRouter.post(
  "/role",
  checkPermissions("role"),
  postRoleValidator,
  httpPostRole,
);

// Modifier le nom du rôle ou/et modifier les permissions
permissionRouter.put(
  "/role/:id",
  checkPermissions("role"),
  putRoleValidator,
  httpPutRole,
);

permissionRouter.delete(
  "/role/:role",
  checkPermissions("role"),
  deleteRoleValidator,
  httpDeleteRole,
);

export default permissionRouter;

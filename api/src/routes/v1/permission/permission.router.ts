import { Router } from "express";
import checkPermissions from "../../../middleware/check-permissions";
import httpGetPermissions from "../../../controllers/permission/http-get-permissions";
import httpGetRoles from "../../../controllers/permission/http-get-roles";
import httpDeleteRole from "../../../controllers/permission/http-delete-role";
import httpPostRole from "../../../controllers/permission/http-post-role";
import {
  deleteManyRolesValidator,
  deleteRoleValidator,
  getPermissionsValidator,
  postRoleValidator,
  putRoleValidator,
} from "./permission-validators";
import httpPutRole from "../../../controllers/permission/http-put-role";
import httpGetSearchRoles from "../../../controllers/permission/http-get-search-roles";
import httpDeleteManyRoles from "../../../controllers/permission/http-delete-many-roles";
import httpGetResourcesByRole from "../../../controllers/permission/http-get-resources-by-role";
import httpGetResourcesById from "../../../controllers/permission/http-get-resources-by-id";

const permissionRouter = Router();

// Obtenir la liste des rôles existants avec le nombre de permissions associés à chaque type d'actions (crud)
permissionRouter.get("/role", checkPermissions("role"), httpGetRoles);

// Recherche de rôles
permissionRouter.get(
  "/search/role/:searchValue/",
  checkPermissions("role"),
  httpGetSearchRoles,
);

/**
 * Obtenir la liste de toute les ressources existantes
 * (renvoi un tableau combinant le nom de tous les rôles ainsi que toutes les ressources defs)
 **/
permissionRouter.get(
  "/resources/role/:role",
  checkPermissions("role"),
  getPermissionsValidator("role"),
  httpGetResourcesByRole,
);

/**
 * Obtenir la liste de toute les ressources existantes
 * (renvoi un tableau combinant le nom de tous les rôles ainsi que toutes les ressources defs)
 **/
permissionRouter.get(
  "/resources/id/:id",
  checkPermissions("role"),
  getPermissionsValidator("id"),
  httpGetResourcesById,
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
  "/role/:roleId",
  checkPermissions("role"),
  deleteRoleValidator,
  httpDeleteRole,
);

permissionRouter.delete(
  "/roles",
  checkPermissions("role"),
  deleteManyRolesValidator,
  httpDeleteManyRoles,
);

export default permissionRouter;

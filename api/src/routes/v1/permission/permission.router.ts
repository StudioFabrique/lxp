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
  removePermissionValidator,
  roleIdValidator,
} from "./permission-validators";
import httpPutRole from "../../../controllers/permission/http-put-role";
import httpGetSearchRoles from "../../../controllers/permission/http-get-search-roles";
import httpDeleteManyRoles from "../../../controllers/permission/http-delete-many-roles";
import httpGetResourcesByRole from "../../../controllers/permission/http-get-resources-by-role";
import httpGetResourcesById from "../../../controllers/permission/http-get-resources-by-id";
import httpRemovePermissionFromRole from "../../../controllers/permission/http-remove-permission-from-role";
import httpAddPermissionToRole from "../../../controllers/permission/http-add-permission-to-role";
import httpPutResetRole from "../../../controllers/permission/http-put-reset-role";

const permissionRouter = Router();

// Obtenir la liste des rôles existants avec le nombre de permissions associés à chaque type d'actions (crud)
permissionRouter.get(
  "/role",
  checkPermissions("role", "read"),
  httpGetRoles,
);

// Recherche de rôles
permissionRouter.get(
  "/search/role/:searchValue/",
  checkPermissions("role", "read"),
  httpGetSearchRoles
);

/**
 * Obtenir la liste de toute les ressources existantes
 * (renvoi un tableau combinant le nom de tous les rôles ainsi que toutes les ressources defs)
 **/
permissionRouter.get(
  "/resources/role/:role",
  checkPermissions("role", "read"),
  getPermissionsValidator("role"),
  httpGetResourcesByRole
);

/**
 * Obtenir la liste de toute les ressources existantes
 * (renvoi un tableau combinant le nom de tous les rôles ainsi que toutes les ressources defs)
 **/
permissionRouter.get(
  "/resources/id/:id",
  checkPermissions("role", "read"),
  getPermissionsValidator("id"),
  httpGetResourcesById
);

// Obtenir la liste des permissions associées à un rôle
permissionRouter.get(
  "/:role",
  checkPermissions("role", "read"),
  getPermissionsValidator,
  httpGetPermissions
);

// Créer un rôle ou copier un rôle avec ses permissions
permissionRouter.post(
  "/role",
  checkPermissions("role", "write"),
  postRoleValidator,
  httpPostRole
);

// Modifier le nom du rôle ou/et modifier les permissions
permissionRouter.put(
  "/role/:id",
  checkPermissions("role", "update"),
  putRoleValidator,
  httpPutRole
);

// Réinitialiser les permissions du rôle
permissionRouter.put(
  "/role/:id/reset",
  checkPermissions("role", "update"),
  roleIdValidator,
  httpPutResetRole
);

// Ajouter une permission spécifique à un rôle
permissionRouter.post(
  "/role/:roleId/permission/:permission",
  checkPermissions("role", "update"),
  removePermissionValidator,
  httpAddPermissionToRole
);

// Supprimer une permission spécifique d'un rôle
permissionRouter.delete(
  "/role/:roleId/permission/:permission",
  checkPermissions("role", "update"),
  removePermissionValidator,
  httpRemovePermissionFromRole
);

// Supprimer un rôle spécifique
permissionRouter.delete(
  "/role/:roleId",
  checkPermissions("role", "delete"),
  deleteRoleValidator,
  httpDeleteRole
);

// Supprimer des rôles spécifiques
permissionRouter.delete(
  "/roles",
  checkPermissions("role", "delete"),
  deleteManyRolesValidator,
  httpDeleteManyRoles
);

export default permissionRouter;

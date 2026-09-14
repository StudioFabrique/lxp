import {
  LoaderCircle,
  LockKeyhole,
  Plus,
  Shield,
  UserRound,
  X,
} from "lucide-react";

import PermissionGuard from "../../../../components/guards/PermissionGuard";
import RightSideDrawer from "../../../../components/UI/right-side-drawer/right-side-drawer";
import type {
  PermissionItem,
  PermissionTypes,
  RoleCounts,
} from "../../api/role.api";
import useRoleEdit from "../../hooks/useRoleEdit";

type RolePermissionsDrawerProps = {
  role: RoleCounts;
  permissionType: PermissionTypes;
  permissionLabel: string;
  onClose: () => void;
};

const sortPermissions = (items: PermissionItem[] | undefined) =>
  [...(items ?? [])].sort((first, second) =>
    first.name.localeCompare(second.name, "fr", { sensitivity: "base" }),
  );

const PermissionIcon = ({ isRole }: { isRole?: boolean }) =>
  isRole ? (
    <UserRound className="size-4 text-info" />
  ) : (
    <Shield className="size-4 text-warning" />
  );

export default function RolePermissionsDrawer({
  role,
  permissionType,
  permissionLabel,
  onClose,
}: RolePermissionsDrawerProps) {
  const {
    permissions,
    remainingResources,
    role: detailedRole,
    isLoading,
    isError,
    onAddPermission,
    onDeletePermission,
    pendingPermission,
    isUpdatingPermission,
  } = useRoleEdit(role._id);
  const assignedPermissions = sortPermissions(permissions?.[permissionType]);
  const availablePermissions = sortPermissions(
    remainingResources?.[permissionType],
  );
  const permissionsAreLocked =
    (detailedRole?.protection ?? role.protection) >= 2;

  const readOnlyItem = (permission: PermissionItem) => (
    <span className="flex items-center gap-2 rounded-field border border-base-300 bg-base-100 px-3 py-2 text-sm">
      <PermissionIcon isRole={permission.isRole} />
      <span className="capitalize">{permission.name}</span>
    </span>
  );

  return (
    <RightSideDrawer
      id="role-permissions-drawer"
      visible={false}
      isOpen
      panelClassName="w-1/2 min-w-0"
      title={`${permissionLabel} · ${role.label}`}
      onCloseDrawer={onClose}
    >
      <div className="flex min-h-full flex-col gap-8 pb-8">
        {permissionsAreLocked ? (
          <div className="flex gap-4 mx-auto text-info">
            <LockKeyhole className="size-5" />
            <span>Les permissions de ce rôle système sont verrouillées.</span>
          </div>
        ) : null}

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center py-16">
            <LoaderCircle className="size-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="alert alert-error">
            Impossible de charger les permissions de ce rôle.
          </div>
        ) : (
          <>
            <section className="flex flex-col gap-3">
              <div>
                <h3 className="font-bold">Permissions attribuées</h3>
                <p className="text-xs text-base-content/60">
                  Cliquez sur une permission pour la retirer.
                </p>
              </div>

              {assignedPermissions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {assignedPermissions.map((permission) => (
                    <PermissionGuard
                      key={permission.fullName}
                      action="update"
                      object="role"
                      fallback={readOnlyItem(permission)}
                    >
                      <button
                        type="button"
                        className="btn btn-sm h-auto min-h-9 gap-2 border-base-300 bg-base-100 font-normal"
                        title={permission.description}
                        disabled={permissionsAreLocked || isUpdatingPermission}
                        onClick={() => onDeletePermission(permission.fullName)}
                      >
                        <PermissionIcon isRole={permission.isRole} />
                        <span className="capitalize">{permission.name}</span>
                        {isUpdatingPermission &&
                        pendingPermission === permission.fullName ? (
                          <LoaderCircle className="size-4 animate-spin" />
                        ) : (
                          <X className="size-4 text-error" />
                        )}
                      </button>
                    </PermissionGuard>
                  ))}
                </div>
              ) : (
                <p className="rounded-box border border-dashed border-base-300 p-4 text-sm text-base-content/60">
                  Aucune permission attribuée.
                </p>
              )}
            </section>

            <section className="flex flex-col gap-3 border-t border-base-300 pt-6">
              <div>
                <h3 className="font-bold">Permissions non attribuées</h3>
                <p className="text-xs text-base-content/60">
                  Cliquez sur une permission pour l'ajouter.
                </p>
              </div>

              {availablePermissions.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {availablePermissions.map((permission) => (
                    <PermissionGuard
                      key={permission.fullName}
                      action="update"
                      object="role"
                      fallback={readOnlyItem(permission)}
                    >
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-field border border-base-300 bg-base-100 px-3 py-2 text-left transition-colors hover:border-primary/40 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={permissionsAreLocked || isUpdatingPermission}
                        onClick={() => onAddPermission(permission.fullName)}
                      >
                        <PermissionIcon isRole={permission.isRole} />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold capitalize">
                            {permission.name}
                          </span>
                          {permission.description ? (
                            <span className="block text-xs text-base-content/60">
                              {permission.description}
                            </span>
                          ) : permission.isRole ? (
                            <span className="block text-xs text-base-content/60">
                              Accès aux utilisateurs possédant ce rôle
                            </span>
                          ) : null}
                        </span>
                        {isUpdatingPermission &&
                        pendingPermission === permission.fullName ? (
                          <LoaderCircle className="size-4 animate-spin" />
                        ) : (
                          <Plus className="size-4 text-success" />
                        )}
                      </button>
                    </PermissionGuard>
                  ))}
                </div>
              ) : (
                <p className="rounded-box border border-dashed border-base-300 p-4 text-sm text-base-content/60">
                  Toutes les permissions sont déjà attribuées.
                </p>
              )}
            </section>
          </>
        )}
      </div>
    </RightSideDrawer>
  );
}

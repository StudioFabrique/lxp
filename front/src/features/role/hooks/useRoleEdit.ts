import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { roleQueries, roleMutations } from "../role.api";
import type { Permissions, PermissionItem, PermissionTypes } from "../role.api";
import { useCallback, useMemo } from "react";

function useRoleEdit(id: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["permission-resources", id],
    queryFn: () => roleQueries.getPermissions(id),
  });

  const permissions: Permissions | undefined = useMemo(() => {
    if (!data) return undefined;

    const permissionTypes: PermissionTypes[] = [
      "read",
      "write",
      "update",
      "delete",
    ];

    const result = permissionTypes.reduce(
      (acc, type) => ({
        ...acc,
        [type]: data.permissions
          .filter((p: string) => p.startsWith(`${type}:`))
          .map((p: string) => {
            const name = p.split(":")[1];
            return {
              name,
              fullName: p,
              description:
                data.ressources.ressources.find((r) => r.name === name)
                  ?.description || "",
              isRole:
                name === "everything"
                  ? true
                  : Boolean(data.ressources.roles.find((r) => r === name)),
            };
          }),
      }),
      {} as Permissions,
    );

    return result;
  }, [data]);

  const resources: PermissionItem[] | undefined = useMemo(() => {
    if (!data) return undefined;

    return [
      ...data.ressources.ressources.map((r) => ({
        name: r.name,
        fullName: r.name,
        description: r.description,
      })),
      ...data.ressources.roles.map((r) => ({
        name: r,
        fullName: r,
        isRole: true,
      })),
      {
        name: "everything",
        fullName: "everything",
        description:
          "Permet d'acceder a tous les roles en même temps (utilisé dans la liste d'utilisateur)",
        isRole: true,
      },
    ];
  }, [data]);

  const remainingResources = useMemo(() => {
    if (!permissions || !resources) return undefined;

    const permissionTypes: PermissionTypes[] = [
      "read",
      "write",
      "update",
      "delete",
    ];

    return permissionTypes.reduce(
      (acc, type) => ({
        ...acc,
        [type]: resources
          .filter((res) => !permissions[type].find((p) => p.name === res.name))
          .map((r) => ({ ...r, fullName: `${type}:${r.name}` })),
      }),
      {} as Permissions,
    );
  }, [permissions, resources]);

  const refetchPermissions = () => {
    queryClient.invalidateQueries({ queryKey: ["permission-resources", id] });
  };

  const addPermissionMutation = useMutation({
    mutationFn: (name: string) => roleMutations.addPermission(id, name),
    onSuccess: refetchPermissions,
  });

  const deletePermissionMutation = useMutation({
    mutationFn: (name: string) => roleMutations.deletePermission(id, name),
    onSuccess: refetchPermissions,
  });

  const resetPermissionsMutation = useMutation({
    mutationFn: () => roleMutations.resetPermissions(id),
    onSuccess: () => {
      refetchPermissions();
      toast.success("Permissions réinitialisées avec succès");
    },
  });

  const handleAddPermission = useCallback(
    (name: string) => {
      addPermissionMutation.mutate(name);
    },
    [addPermissionMutation],
  );

  const handleDeletePermission = useCallback(
    (name: string) => {
      deletePermissionMutation.mutate(name);
    },
    [deletePermissionMutation],
  );

  const handleResetPermissions = useCallback(() => {
    resetPermissionsMutation.mutate();
  }, [resetPermissionsMutation]);

  return {
    permissions,
    remainingResources,
    role: data?.role ?? null,
    isLoading,
    isError,
    onAddPermission: handleAddPermission,
    onDeletePermission: handleDeletePermission,
    onResetPermissions: handleResetPermissions,
  };
}

export default useRoleEdit;

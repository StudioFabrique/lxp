import { useCallback, useEffect, useMemo, useState } from "react";
import useHttp from "../../../hooks/use-http";
import Role from "../../../utils/interfaces/role";

function useManagePermissions(id: string) {
  const { sendRequest } = useHttp();

  interface PermissionItem {
    name: string;
    fullName: string;
    description?: string;
    isRole?: boolean;
  }

  type PermissionTypes = "read" | "write" | "update" | "delete";

  type Permissions = Record<PermissionTypes, PermissionItem[]>;

  const [permissions, setPermissions] = useState<Permissions>();

  const [resources, setResources] = useState<PermissionItem[]>();

  const [role, setRole] = useState<Role | null>();

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
      {} as Permissions
    );
  }, [permissions, resources]);

  const handleGetPermissionsRequest = useCallback(async () => {
    const applyData = ({
      data,
    }: {
      data: {
        permissions: string[];
        ressources: {
          ressources: { name: string; description: string }[];
          roles: string[];
        };
        role: Role;
      };
    }) => {
      const permissionTypes: PermissionTypes[] = [
        "read",
        "write",
        "update",
        "delete",
      ];

      const permissions = permissionTypes.reduce(
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
        {} as Permissions
      );

      setPermissions(permissions);
      setResources([
        ...data.ressources.ressources.map((r) => ({
          ...r,
          fullName: r.name,
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
      ]);
      setRole(data.role);
    };

    try {
      await sendRequest({ path: `/permission/resources/id/${id}` }, applyData);
    } catch (error: unknown) {
      if (
        (error as { response?: { status: number } }).response?.status === 404
      ) {
        setRole(null);
      }
    }
  }, [id, sendRequest]);

  const handleAddPermission = (name: string) => {
    const applyData = () => {
      handleGetPermissionsRequest();
    };

    sendRequest(
      {
        path: `/permission/role/${id}/permission/${name}`,
        method: "post",
      },
      applyData
    );
  };

  const handleDeletePermission = (name: string) => {
    const applyData = () => {
      handleGetPermissionsRequest();
    };

    sendRequest(
      {
        path: `/permission/role/${id}/permission/${name}`,
        method: "delete",
      },
      applyData
    );
  };

  const handleResetPermissions = () => {
    const applyData = () => {
      handleGetPermissionsRequest();
    };

    sendRequest(
      {
        path: `/permission/role/${id}/reset`,
        method: "put",
      },
      applyData
    );
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleGetPermissionsRequest();
    }, 20);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [handleGetPermissionsRequest]);

  return {
    permissions,
    resources,
    remainingResources,
    role,
    onAddPermission: handleAddPermission,
    onDeletePermission: handleDeletePermission,
    onResetPermissions: handleResetPermissions,
  };
}

export default useManagePermissions;

import { useCallback, useEffect, useMemo, useState } from "react";
import useHttp from "../../../hooks/use-http";
import Role from "../../../utils/interfaces/role";

function useManagePermissions(id: string) {
  const { sendRequest } = useHttp();

  const [permissions, setPermissions] = useState<{
    read: { name: string; fullName: string; description: string }[];
    write: { name: string; fullName: string; description: string }[];
    update: { name: string; fullName: string; description: string }[];
    delete: { name: string; fullName: string; description: string }[];
  }>();

  const [resources, setResources] =
    useState<{ name: string; fullName: string; description: string }[]>();

  const [role, setRole] = useState<Role | null>();

  const remainingResources = useMemo(() => {
    if (!permissions || !resources) return undefined;

    const {
      read: readPerms,
      write: writePerms,
      update: updatePerms,
      delete: deletePerms,
    } = permissions;

    return {
      read: resources
        .filter((res) => !readPerms.find((p) => p.name === res.name))
        .map((r) => ({ ...r, fullName: `read:${r.name}` })),
      write: resources
        .filter((res) => !writePerms.find((p) => p.name === res.name))
        .map((r) => ({ ...r, fullName: `write:${r.name}` })),
      update: resources
        .filter((res) => !updatePerms.find((p) => p.name === res.name))
        .map((r) => ({ ...r, fullName: `update:${r.name}` })),
      delete: resources
        .filter((res) => !deletePerms.find((p) => p.name === res.name))
        .map((r) => ({ ...r, fullName: `delete:${r.name}` })),
    };
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
      const permissions = {
        read: data.permissions
          .filter((p: string) => p.startsWith("read:"))
          .map((p: string) => {
            const name = p.split(":")[1];
            return {
              name,
              fullName: p,
              description:
                data.ressources.ressources.find((r) => r.name === name)
                  ?.description || "",
            };
          }),
        write: data.permissions
          .filter((p: string) => p.startsWith("write:"))
          .map((p: string) => {
            const name = p.split(":")[1];
            return {
              name,
              fullName: p,
              description:
                data.ressources.ressources.find((r) => r.name === name)
                  ?.description || "",
            };
          }),
        update: data.permissions
          .filter((p: string) => p.startsWith("update:"))
          .map((p: string) => {
            const name = p.split(":")[1];
            return {
              name,
              fullName: p,
              description:
                data.ressources.ressources.find((r) => r.name === name)
                  ?.description || "",
            };
          }),
        delete: data.permissions
          .filter((p: string) => p.startsWith("delete:"))
          .map((p: string) => {
            const name = p.split(":")[1];
            return {
              name,
              fullName: p,
              description:
                data.ressources.ressources.find((r) => r.name === name)
                  ?.description || "",
            };
          }),
      };

      setPermissions(permissions);
      setResources(
        data.ressources.ressources.map((r) => ({
          ...r,
          fullName: r.name,
        })),
      );
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
      applyData,
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
      applyData,
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
  };
}

export default useManagePermissions;

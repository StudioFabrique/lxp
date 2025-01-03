import { useCallback, useEffect, useMemo, useState } from "react";
import useHttp from "../../../hooks/use-http";
import Role from "../../../utils/interfaces/role";

function useManagePermissions(id: string) {
  const { sendRequest } = useHttp();

  const [permissions, setPermissions] = useState<{
    read: { name: string; description: string }[];
    write: { name: string; description: string }[];
    update: { name: string; description: string }[];
    delete: { name: string; description: string }[];
  }>();

  const [resources, setResources] =
    useState<{ name: string; description: string }[]>();

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
      read: resources.filter(
        (res) => !readPerms.find((p) => p.name === res.name),
      ),
      write: resources.filter(
        (res) => !writePerms.find((p) => p.name === res.name),
      ),
      update: resources.filter(
        (res) => !updatePerms.find((p) => p.name === res.name),
      ),
      delete: resources.filter(
        (res) => !deletePerms.find((p) => p.name === res.name),
      ),
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
      console.log({ data });

      const permissions = {
        read: data.permissions
          .filter((p: string) => p.startsWith("read:"))
          .map((p: string) => {
            const name = p.split(":")[1];
            return {
              name,
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
              description:
                data.ressources.ressources.find((r) => r.name === name)
                  ?.description || "",
            };
          }),
      };

      setPermissions(permissions);
      setResources(data.ressources.ressources);
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
    console.log({ name });
  };

  const handleDeletePermission = (name: string) => {
    console.log({ name });
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

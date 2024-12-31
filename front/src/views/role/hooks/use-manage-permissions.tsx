import { useCallback, useEffect, useMemo, useState } from "react";
import useHttp from "../../../hooks/use-http";
import Role from "../../../utils/interfaces/role";

function useManagePermissions(id: string) {
  const { sendRequest } = useHttp();

  const [permissions, setPermissions] = useState<{
    read: string[];
    write: string[];
    update: string[];
    delete: string[];
  }>();
  const [ressources, setRessources] =
    useState<{ name: string; description: string }[]>();
  const [role, setRole] = useState<Role | null>();

  const remainingRessources = useMemo(() => {
    if (!permissions || !ressources) return undefined;

    const {
      read: readPerms,
      write: writePerms,
      update: updatePerms,
      delete: deletePerms,
    } = permissions;

    return {
      read: ressources.filter((res) => !readPerms.includes(res.name)),
      write: ressources.filter((res) => !writePerms.includes(res.name)),
      update: ressources.filter((res) => !updatePerms.includes(res.name)),
      delete: ressources.filter((res) => !deletePerms.includes(res.name)),
    };
  }, [permissions, ressources]);

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
          .map((p: string) => p.split(":")[1]),
        write: data.permissions
          .filter((p: string) => p.startsWith("write:"))
          .map((p: string) => p.split(":")[1]),
        update: data.permissions
          .filter((p: string) => p.startsWith("update:"))
          .map((p: string) => p.split(":")[1]),
        delete: data.permissions
          .filter((p: string) => p.startsWith("delete:"))
          .map((p: string) => p.split(":")[1]),
      };

      setPermissions(permissions);
      setRessources(data.ressources.ressources);
      setRole(data.role);
    };

    try {
      await sendRequest({ path: `/permission/ressources/id/${id}` }, applyData);
    } catch (error: unknown) {
      if (
        (error as { response?: { status: number } }).response?.status === 404
      ) {
        setRole(null);
      }
    }
  }, [id, sendRequest]);

  useEffect(() => {
    handleGetPermissionsRequest();
  }, [handleGetPermissionsRequest]);

  return { permissions, ressources, remainingRessources, role };
}

export default useManagePermissions;

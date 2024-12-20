import { useCallback, useEffect, useMemo, useState } from "react";
import useHttp from "../../../hooks/use-http";
import Role from "../../../utils/interfaces/role";

function useManagePermissions(id: string) {
  const { sendRequest, isLoading } = useHttp();

  const [permissions, setPermissions] = useState<{
    read: string[];
    write: string[];
    update: string[];
    delete: string[];
  }>();
  const [ressources, setRessources] = useState<string[]>();
  const [role, setRole] = useState<Role>();

  const remainingRessources = useMemo(() => {
    if (!permissions || !ressources) return [];

    const {
      read: readPerms,
      write: writePerms,
      update: updatePerms,
      delete: deletePerms,
    } = permissions;

    const resources = {
      read: ressources.filter((r) => !readPerms.includes(r)),
      write: ressources.filter((r) => !writePerms.includes(r)),
      update: ressources.filter((r) => !updatePerms.includes(r)),
      delete: ressources.filter((r) => !deletePerms.includes(r)),
    };

    return resources;
  }, [permissions, ressources]);

  const handleGetPermissionsRequest = useCallback(async () => {
    const applyData = ({
      data,
    }: {
      data: {
        permissions: string[];
        ressources: { ressources: string[]; roles: string[] };
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

    await sendRequest({ path: `/permission/ressources/id/${id}` }, applyData);
  }, [id, sendRequest]);

  useEffect(() => {
    handleGetPermissionsRequest();
  }, [handleGetPermissionsRequest]);

  return { permissions, ressources, role, isLoading };
}

export default useManagePermissions;

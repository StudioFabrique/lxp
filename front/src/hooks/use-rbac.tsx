/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect } from "react";
import Role from "../utils/interfaces/role";
import useHttp from "./use-http";
import { casbinAuthorizer } from "../config/rbac";
import toast from "react-hot-toast";

const useRbac = (roles: Role[] | undefined) => {
  const { sendRequest, error } = useHttp();

  const defineRulesFor = useCallback(async () => {
    if (!roles) return;

    // superUser roles definition
    const builtPerms: Record<string, any> = {};

    // perms should be of format
    // { 'read': ['Contact', 'Database']}
    for (const role of roles) {
      const applyData = (data: any) => {
        const permissions: any[] = data.data;

        permissions.forEach((permission) => {
          builtPerms[permission.action] = [
            ...(builtPerms[permission.action] || []),
            ...permission.ressources,
          ];
        });
      };

      await sendRequest(
        { path: `/permission/${role.role}`, method: "get" },
        applyData
      );
    }

    casbinAuthorizer.setPermission(builtPerms);
    console.log({ casbinAuthorizer });
  }, [roles, sendRequest]);

  const forceRefreshRbacPermissions = () => {
    defineRulesFor();
  };

  useEffect(() => {
    defineRulesFor();
  }, [defineRulesFor]);

  // gestion des erreurs HTTP
  useEffect(() => {
    if (error.length > 0) toast.error(error);
  }, [error]);

  return {
    forceRefreshRbacPermissions,
  };
};

export default useRbac;

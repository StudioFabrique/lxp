import { useCallback, useEffect, useState } from "react";
import Role from "../utils/interfaces/role";
import useHttp from "./use-http";
import { casbinAuthorizer } from "../config/rbac";

const useRbac = (roles: Role[] | undefined) => {
  const [needRefresh, setRefreshState] = useState<boolean>();

  const { sendRequest } = useHttp();

  const defineRulesFor = useCallback(() => {
    if (!roles) return;

    // superUser roles definition
    const builtPerms: Record<string, any> = {};

    // perms should be of format
    // { 'read': ['Contact', 'Database']}
    roles.forEach((role) => {
      const applyData = (data: any) => {
        const permissions: any[] = data.data;

        permissions.forEach((permission) => {
          builtPerms[key] = [...(builtPerms[key] || []), ...(value as [])];
        });
      };
      sendRequest(
        { path: `/permission/${role.role}`, method: "get" },
        applyData
      );
    });
    console.log({ builtPerms });

    casbinAuthorizer.setPermission(builtPerms);
  }, [roles, sendRequest]);

  useEffect(() => {
    defineRulesFor();
  }, [defineRulesFor]);

  /* useEffect(() => {
    if (needRefresh) {
      defineRulesFor();
      setRefreshState(false);
    }
  }, [defineRulesFor, needRefresh]); */

  const refreshRbacPermissions = () => {
    setRefreshState(true);
  };

  return { refreshRbacPermissions };
};

export default useRbac;

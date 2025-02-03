import { useCallback, useEffect, useMemo, useState } from "react";
import Role from "../utils/interfaces/role";
import useHttp from "./use-http";
import User from "../utils/interfaces/user";

const useGetRoles = (user: User) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const { sendRequest } = useHttp();

  const userRole = useMemo(() => user?.roles?.[0], [user?.roles]);

  const fetchRoles = useCallback(
    (role: Role) => {
      const applyData = (data: Array<Role>) => {
        const newRole = {
          _id: "0",
          role: "everything",
          label: "Tou",
          rank: role.rank,
          protection: 0,
        };
        let updatedRoles = Array<Role>();
        updatedRoles = [...data, newRole];
        data.forEach((item) => updatedRoles.push(item));
        setRoles(updatedRoles);
      };
      sendRequest(
        {
          path: "/auth/roles",
        },
        applyData
      );
    },
    [sendRequest]
  );

  useEffect(() => {
    if (userRole && roles.length === 0) fetchRoles(userRole);
  }, [fetchRoles, userRole, roles]);

  return { roles };
};

export default useGetRoles;

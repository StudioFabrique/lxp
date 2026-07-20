import { useQuery } from "@tanstack/react-query";

import type User from "../../../utils/interfaces/user";
import { parcoursApi } from "../api/parcours.api";

type GroupWithUsers = {
  _id: string;
  name: string;
  users: User[];
};

export function useParcoursStudentsQuery(groupIds: string[]) {
  return useQuery({
    queryKey: ["parcours", "students", [...groupIds].sort()],
    queryFn: async () => {
      const groups = (await parcoursApi.queries.getStudentsByGroupIds(
        groupIds,
      )) as GroupWithUsers[];

      return groups.flatMap((group) =>
        group.users.map((user) => ({
          ...user,
          group: { _id: group._id, name: group.name },
        })),
      );
    },
    enabled: groupIds.length > 0,
  });
}

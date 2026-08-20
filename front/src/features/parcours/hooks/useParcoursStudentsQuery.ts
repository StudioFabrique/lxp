import { useQuery } from "@tanstack/react-query";

import type Group from "../../../utils/interfaces/group";
import type User from "../../../utils/interfaces/user";
import { parcoursApi } from "../api/parcours.api";

type GroupWithUsers = {
  _id: string;
  name: string;
  users: User[];
};

/**
 * Apprenant enrichi du groupe par lequel il est rattaché au parcours.
 *
 * Seuls l'identifiant et le nom du groupe sont remontés : les typer en `Group`
 * complet obligeait à fabriquer des champs dont la requête ne dispose pas.
 */
export type StudentWithGroup = Omit<User, "group"> & {
  group: Pick<Group, "_id" | "name">;
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

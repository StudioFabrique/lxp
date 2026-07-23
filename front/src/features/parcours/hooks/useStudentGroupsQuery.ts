import { useQuery } from "@tanstack/react-query";

import { parcoursApi } from "../api/parcours.api";

export function useStudentGroupsQuery() {
  return useQuery({
    queryKey: ["student-groups"],
    queryFn: parcoursApi.queries.getStudentGroups,
    select: (response) => response.data,
  });
}

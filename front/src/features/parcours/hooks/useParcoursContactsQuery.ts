import { useQuery } from "@tanstack/react-query";

import { parcoursApi } from "../api/parcours.api";
import { parcoursKeys } from "../api/parcours.keys";

export function useParcoursContactsQuery() {
  return useQuery({
    queryKey: parcoursKeys.availableContacts(),
    queryFn: parcoursApi.queries.getContacts,
  });
}

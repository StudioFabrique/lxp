import { useQuery } from "@tanstack/react-query";

import { parcoursApi } from "../api/parcours.api";
import { parcoursKeys } from "../api/parcours.keys";

export function useParcoursTagsQuery() {
  return useQuery({
    queryKey: parcoursKeys.availableTags(),
    queryFn: parcoursApi.queries.getTags,
  });
}

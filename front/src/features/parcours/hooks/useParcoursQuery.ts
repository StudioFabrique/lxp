import { useQuery } from "@tanstack/react-query";

import { parcoursApi } from "../api/parcours.api";
import { parcoursKeys } from "../api/parcours.keys";

export function useParcoursQuery(id?: number) {
  return useQuery({
    queryKey: parcoursKeys.detail(id ?? 0),
    queryFn: () => parcoursApi.queries.getById(id!),
    enabled: id !== undefined && Number.isInteger(id) && id > 0,
  });
}

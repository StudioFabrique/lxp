import { useQuery } from "@tanstack/react-query";

import type Group from "../../../utils/interfaces/group";
import { parcoursApi } from "../api/parcours.api";
import { parcoursKeys } from "../api/parcours.keys";
import { useParcoursQuery } from "./useParcoursQuery";

type GroupRelation = Group | { group: { idMdb?: string; _id?: string } };

export function useParcoursGroupsQuery(parcoursId: number) {
  const parcoursQuery = useParcoursQuery(parcoursId);
  const groupIds = ((parcoursQuery.data?.groups ?? []) as GroupRelation[])
    .map((item) => {
      // Le parcours porte tantôt le groupe lui-même, tantôt la relation qui
      // l'enveloppe ; seule la seconde forme expose `idMdb`.
      if ("group" in item) return item.group.idMdb ?? item.group._id;
      return item._id;
    })
    .filter(Boolean) as string[];

  return useQuery({
    queryKey: [...parcoursKeys.detail(parcoursId), "groups", groupIds],
    queryFn: () =>
      parcoursApi.queries.getStudentsByGroupIds(groupIds) as Promise<Group[]>,
    enabled: parcoursQuery.isSuccess && groupIds.length > 0,
  });
}

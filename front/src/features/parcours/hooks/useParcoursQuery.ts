import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type Parcours from "../../../utils/interfaces/parcours";
import {
  parcoursApi,
  type UpdateParcoursPayload,
  type UpdateParcoursResponse,
} from "../api/parcours.api";

export const parcoursKeys = {
  all: ["parcours"] as const,
  detail: (id: number) => [...parcoursKeys.all, "detail", id] as const,
};

export function useParcoursQuery(id?: number) {
  return useQuery({
    queryKey: parcoursKeys.detail(id ?? 0),
    queryFn: () => parcoursApi.queries.getById(id!),
    enabled: id !== undefined && Number.isInteger(id) && id > 0,
  });
}

export function useParcoursTagsQuery() {
  return useQuery({
    queryKey: [...parcoursKeys.all, "available-tags"],
    queryFn: parcoursApi.queries.getTags,
  });
}

export function useParcoursContactsQuery() {
  return useQuery({
    queryKey: [...parcoursKeys.all, "available-contacts"],
    queryFn: parcoursApi.queries.getContacts,
  });
}

export function useUpdateParcours(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateParcoursPayload) =>
      parcoursApi.mutations.updateParcours(id, payload),
    onSuccess: (response: UpdateParcoursResponse) => {
      queryClient.setQueryData<Parcours>(parcoursKeys.detail(id), (current) =>
        current ? { ...current, ...response.parcours } : current,
      );
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === parcoursKeys.all[0] &&
          typeof query.queryKey[1] === "object",
      });
    },
  });
}

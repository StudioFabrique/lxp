import { useMutation, useQueryClient } from "@tanstack/react-query";

import type Parcours from "../../../utils/interfaces/parcours";
import {
  parcoursApi,
  type UpdateParcoursPayload,
  type UpdateParcoursResponse,
} from "../api/parcours.api";
import { parcoursKeys } from "../api/parcours.keys";

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

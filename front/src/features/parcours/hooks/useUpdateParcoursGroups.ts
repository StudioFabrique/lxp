import { useMutation, useQueryClient } from "@tanstack/react-query";

import { parcoursApi } from "../api/parcours.api";
import { parcoursKeys } from "../api/parcours.keys";

export function useUpdateParcoursGroups(parcoursId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupIds: string[]) =>
      parcoursApi.mutations.updateParcoursGroups({
        parcoursId: String(parcoursId),
        groupsIds: groupIds,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: parcoursKeys.detail(parcoursId),
      });
    },
  });
}

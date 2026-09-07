import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { getApiErrorMessage } from "../../../utils/helpers/api-error-message";
import { parcoursApi } from "../api/parcours.api";
import { parcoursKeys } from "../api/parcours.keys";

export function useRemoveModuleContact(parcoursId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { moduleId: number; contactId: number }) =>
      parcoursApi.mutations.removeModuleContact({ parcoursId, ...data }),
    onSuccess: (data) => {
      toast.success(data.message);
      void queryClient.invalidateQueries({
        queryKey: parcoursKeys.detail(parcoursId),
      });
      void queryClient.invalidateQueries({ queryKey: ["modules"] });
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "La ressource pédagogique n'a pas pu être retirée du module.",
        ),
      );
    },
  });
}

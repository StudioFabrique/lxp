import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { getApiErrorMessage } from "../../../utils/helpers/api-error-message";
import { parcoursApi } from "../api/parcours.api";
import { parcoursKeys } from "../api/parcours.keys";
import { useRoleLabels } from "../../role/hooks/useRoleLabels";

export function useAssignModuleContacts(parcoursId: number) {
  const { teamLabel } = useRoleLabels();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { moduleIds: number[]; contactIds: number[] }) =>
      parcoursApi.mutations.assignModuleContacts({ parcoursId, ...data }),
    onSuccess: async (data) => {
      toast.success(data.message);
      await queryClient.invalidateQueries({
        queryKey: parcoursKeys.detail(parcoursId),
      });
      void queryClient.invalidateQueries({ queryKey: ["modules"] });
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          `Les membres « ${teamLabel} » n'ont pas pu être affectés.`,
        ),
      );
    },
  });
}

import {
  useMutation,
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { groupMutations } from "../../../api-queries/group.api";
import { PaginatedResponse } from "../../../api-queries/generic/table.api";

/**
 * Custom hook pour gérer les actions groupées sur les groupes
 */
function useGroupActions(
  idsList: string[],
  onRefreshData: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<NoInfer<PaginatedResponse<unknown>>, Error>>,
) {
  // Magie de TanStack Query pour les actions d'écriture/suppression
  const mutation = useMutation({
    mutationFn: () => groupMutations.deleteMany(idsList),

    onSuccess: () => {
      toast.success("Groupes supprimés !");
      onRefreshData();
    },
  });

  const handleDeleteSelectedGroups = async () => {
    if (idsList.length === 0) return;

    mutation.mutate();
  };

  return {
    onDeleteSelectedGroups: handleDeleteSelectedGroups,
    isDeleting: mutation.isPending,
  };
}

export default useGroupActions;

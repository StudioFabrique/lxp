import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { roleApi } from "../api/role.api";
import { getApiErrorMessage } from "../../../utils/helpers/api-error-message";

const DELETE_ERROR_FALLBACK = "Impossible de supprimer ce rôle.";
const DELETE_MANY_ERROR_FALLBACK =
  "Impossible de supprimer tous les rôles sélectionnés.";

export function useRoleActions(onSuccessCallback: () => void) {
  const deleteManyMutation = useMutation({
    mutationFn: (ids: string[]) => roleApi.mutations.deleteMany(ids),
    onSuccess: () => {
      toast.success("Rôles supprimés avec succès");
      onSuccessCallback();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, DELETE_MANY_ERROR_FALLBACK));
    },
  });

  const handleDeleteSelected = async (idsList: string[]) => {
    if (idsList.length === 0) return;
    deleteManyMutation.mutate(idsList);
  };

  const deleteOneMutation = useMutation({
    mutationFn: (id: string) => roleApi.mutations.deleteOne(id),
    onSuccess: () => {
      toast.success("Rôle supprimé avec succès");
      onSuccessCallback();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, DELETE_ERROR_FALLBACK));
    },
  });

  const handleDeleteOne = async (id: string) => {
    await deleteOneMutation.mutateAsync(id);
  };

  return {
    onDeleteSelected: handleDeleteSelected,
    onDeleteOne: handleDeleteOne,
    isDeleting: deleteManyMutation.isPending || deleteOneMutation.isPending,
    deleteError: deleteOneMutation.isError
      ? getApiErrorMessage(deleteOneMutation.error, DELETE_ERROR_FALLBACK)
      : undefined,
    resetDeleteError: deleteOneMutation.reset,
  };
}

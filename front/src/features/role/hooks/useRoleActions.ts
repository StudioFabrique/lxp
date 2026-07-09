import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { roleApi } from "../api/role.api";

export function useRoleActions(onSuccessCallback: () => void) {
  const deleteManyMutation = useMutation({
    mutationFn: (ids: string[]) => roleApi.mutations.deleteMany(ids),
    onSuccess: () => {
      toast.success("Rôles supprimés avec succès");
      onSuccessCallback();
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
  });

  const handleDeleteOne = async (id: string) => {
    await deleteOneMutation.mutateAsync(id);
  };

  return {
    onDeleteSelected: handleDeleteSelected,
    onDeleteOne: handleDeleteOne,
    isDeleting: deleteManyMutation.isPending || deleteOneMutation.isPending,
  };
}

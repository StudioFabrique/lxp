import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { groupApi } from "../api/group.api";

export function useGroupActions(onSuccessCallback: () => void) {
  const deleteManyMutation = useMutation({
    mutationFn: (ids: string[]) => groupApi.mutations.deleteMany(ids),
    onSuccess: () => {
      toast.success("Groupes supprimés !");
      onSuccessCallback();
    },
  });

  const handleDeleteSelected = async (idsList: string[]) => {
    if (idsList.length === 0) return;
    deleteManyMutation.mutate(idsList);
  };

  const deleteOneMutation = useMutation({
    mutationFn: (id: string) => groupApi.mutations.deleteOne(id),
    onSuccess: () => {
      toast.success("Groupe supprimé !");
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

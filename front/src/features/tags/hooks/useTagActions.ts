import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { tagApi } from "../api/tag.api";

export function useTagActions(onSuccessCallback: () => void) {
  const showMutationError = (error: AxiosError<{ message?: string }>) => {
    toast.error(
      error.response?.data?.message ?? "Impossible d'enregistrer le tag",
    );
  };

  const deleteManyMutation = useMutation({
    mutationFn: (ids: string[]) => tagApi.mutations.deleteMany(ids),
    onSuccess: () => {
      toast.success("Tags supprimés !");
      onSuccessCallback();
    },
  });

  const handleDeleteSelected = async (idsList: string[]) => {
    if (idsList.length === 0) return;
    deleteManyMutation.mutate(idsList);
  };

  const deleteOneMutation = useMutation({
    mutationFn: (id: number) => tagApi.mutations.deleteOne(id),
    onSuccess: () => {
      toast.success("Tag supprimé !");
      onSuccessCallback();
    },
  });

  const handleDeleteOne = async (id: number) => {
    await deleteOneMutation.mutateAsync(id);
  };

  const createTagsMutation = useMutation({
    mutationFn: (tags: { name: string; color: string }[]) =>
      tagApi.mutations.createTags(tags),
    onSuccess: () => {
      toast.success("Tags créés avec succès");
      onSuccessCallback();
    },
    onError: showMutationError,
  });

  const updateTagMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      tagApi.mutations.updateTag(id, name),
    onSuccess: () => {
      toast.success("Tag modifié avec succès");
      onSuccessCallback();
    },
    onError: showMutationError,
  });

  return {
    onDeleteSelected: handleDeleteSelected,
    onDeleteOne: handleDeleteOne,
    onCreateTags: (tags: { name: string; color: string }[]) =>
      createTagsMutation.mutateAsync(tags),
    onEditTag: (id: number, name: string) =>
      updateTagMutation.mutate({ id, name }),
    isDeleting: deleteManyMutation.isPending || deleteOneMutation.isPending,
    isSubmitting: createTagsMutation.isPending || updateTagMutation.isPending,
  };
}

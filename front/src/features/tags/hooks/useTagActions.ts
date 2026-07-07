import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { tagMutations } from "../tag.api";

export function useTagActions(onSuccessCallback: () => void) {
  const deleteManyMutation = useMutation({
    mutationFn: (ids: string[]) => tagMutations.deleteMany(ids),
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
    mutationFn: (id: number) => tagMutations.deleteOne(id),
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
      tagMutations.createTags(tags),
    onSuccess: () => {
      toast.success("Tags créés avec succès");
      onSuccessCallback();
    },
  });

  const updateTagMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      tagMutations.updateTag(id, name),
    onSuccess: () => {
      toast.success("Tag modifié avec succès");
      onSuccessCallback();
    },
  });

  return {
    onDeleteSelected: handleDeleteSelected,
    onDeleteOne: handleDeleteOne,
    onCreateTags: (tags: { name: string; color: string }[]) =>
      createTagsMutation.mutate(tags),
    onEditTag: (id: number, name: string) =>
      updateTagMutation.mutate({ id, name }),
    isDeleting: deleteManyMutation.isPending || deleteOneMutation.isPending,
    isSubmitting: createTagsMutation.isPending || updateTagMutation.isPending,
  };
}

import { useCallback } from "react";
import toast from "react-hot-toast";
import { useUpdateParcours } from "./useParcoursQuery";

const useInfosService = (parcoursId: number) => {
  const {
    mutateAsync: updateTags,
    isPending: loadingTags,
  } = useUpdateParcours(parcoursId);
  const {
    mutateAsync: updateContacts,
    isPending: loadingContacts,
  } = useUpdateParcours(parcoursId);

  const updateParcoursTags = useCallback(
    async (tagIds: number[]) => {
      try {
        const data = await updateTags({ tagIds });
        if (data.success) {
          toast.success(data.message);
        }
      } catch {
        toast.error("Erreur lors de la mise à jour des tags");
      }
    },
    [updateTags],
  );

  const updateParcoursContacts = useCallback(
    async (contactIds: number[]) => {
      try {
        const data = await updateContacts({ contactIds });
        if (data.success) {
          toast.success(data.message);
        }
      } catch {
        toast.error("Erreur lors de la mise à jour des contacts");
      }
    },
    [updateContacts],
  );

  return {
    loadingContacts,
    loadingTags,
    updateParcoursContacts,
    updateParcoursTags,
  };
};

export default useInfosService;

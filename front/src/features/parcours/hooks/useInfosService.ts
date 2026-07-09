import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import Contact from "../../../utils/interfaces/contact";
import { useParcoursDispatch } from "../store/ParcoursContext";
import { parcoursApi } from "../api/parcours.api";

const useInfosService = () => {
  const [loadingContacts, setLoadingContacts] = useState<boolean>(false);
  const [loadingTags, setLoadingTags] = useState<boolean>(false);
  const dispatch = useParcoursDispatch();

  const updateParcoursTags = useCallback(
    async (parcoursId: number, tagsIds: number[]) => {
      setLoadingTags(true);
      try {
        const data = await parcoursApi.mutations.updateParcoursTags({
          parcoursId,
          tags: tagsIds,
        });
        if (data.success) {
          toast.success(data.message);
        }
      } catch {
        toast.error("Erreur lors de la mise à jour des tags");
      } finally {
        setLoadingTags(false);
      }
    },
    [],
  );

  const updateParcoursContacts = useCallback(
    async (parcoursId: number, contacts: Contact[]) => {
      setLoadingContacts(true);
      try {
        const data = await parcoursApi.mutations.updateParcoursContacts({
          parcoursId,
          contacts,
        });
        if (data.success) {
          toast.success(data.message);
        }
      } catch {
        toast.error("Erreur lors de la mise à jour des contacts");
      } finally {
        setLoadingContacts(false);
      }
    },
    [],
  );

  const getContacts = useCallback(async () => {
    try {
      const data = await parcoursApi.queries.getContacts();
      dispatch({ type: "INIT_CONTACTS", payload: data });
    } catch {
      toast.error("Erreur lors du chargement des contacts");
    }
  }, [dispatch]);

  return {
    loadingContacts,
    loadingTags,
    getContacts,
    updateParcoursContacts,
    updateParcoursTags,
  };
};

export default useInfosService;

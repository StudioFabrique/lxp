import toast from "react-hot-toast";
import useHttp from "../../../hooks/use-http";
import { useNavigate } from "react-router-dom";
import Tag from "../../../utils/interfaces/tag";

/**
 * Custom hook pour gérer les actions groupées sur les tags :
 * - Gestion de la suppression multiple
 *
 * @param idsList - Tableau d'identifiants des tags
 * @param onRefreshData - Fonction pour rafraîchir les données après une action
 */
function useTagsActions(idsList: string[], onRefreshData: () => Promise<void>) {
  const { sendRequest, isLoading } = useHttp(true);
  const navigate = useNavigate();

  const handleCreateTags = async (tags: Tag[]) => {
    const tagsWithoutId = tags.map(({ name, color }) => ({
      name,
      color,
    }));

    const applyData = () => {
      toast.success("Les tags ont été créés avec succès");
      onRefreshData();
      navigate(".", { replace: true });
    };

    await sendRequest(
      {
        path: "/tag",
        method: "post",
        body: { tags: tagsWithoutId },
      },
      applyData,
    );
  };

  const handleDeleteSelectedTags = async () => {
    const applyData = () => {
      toast.success("Les tags ont bien été supprimés avec succès");
      onRefreshData();
    };
    const queryIds = idsList.join(",");

    await sendRequest(
      { path: `/tags/deleteMany/?ids=${queryIds}`, method: "delete" },
      applyData,
    );
  };

  return {
    isSubmitting: isLoading,
    onCreateTags: handleCreateTags,
    onDeleteSelectedTags: handleDeleteSelectedTags,
  };
}

export default useTagsActions;

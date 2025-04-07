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

  const handleCreateTags = (tags: Tag[]) => {
    const tagsWithoutId = tags.map(({ name, color }) => ({
      name,
      color,
    }));

    const applyData = () => {
      toast.success("Les tags ont été créés avec succès");
      onRefreshData();
      navigate(".", { replace: true });
    };

    sendRequest(
      {
        path: "/tag",
        method: "post",
        body: { tags: tagsWithoutId },
      },
      applyData,
    );
  };

  const handleEditTag = (id: number, name: string) => {
    const applyData = () => {
      toast.success("Le tag a été modifié avec succès");
      onRefreshData();
      navigate(".", { replace: true });
    };

    sendRequest(
      {
        path: `/tag/${id}`,
        method: "put",
        body: { name },
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
      { path: `/tag/deleteMany/?ids=${queryIds}`, method: "delete" },
      applyData,
    );
  };

  return {
    isSubmitting: isLoading,
    onCreateTags: handleCreateTags,
    onEditTag: handleEditTag,
    onDeleteSelectedTags: handleDeleteSelectedTags,
  };
}

export default useTagsActions;

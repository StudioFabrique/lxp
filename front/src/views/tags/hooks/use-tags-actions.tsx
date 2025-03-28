import toast from "react-hot-toast";
import useHttp from "../../../hooks/use-http";

/**
 * Custom hook pour gérer les actions groupées sur les tags :
 * - Gestion de la suppression multiple
 *
 * @param idsList - Tableau d'identifiants des tags
 * @param onRefreshData - Fonction pour rafraîchir les données après une action
 */
function useTagsActions(idsList: string[], onRefreshData: () => Promise<void>) {
  const { sendRequest } = useHttp(true);

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

  return { onDeleteSelectedTags: handleDeleteSelectedTags };
}

export default useTagsActions;

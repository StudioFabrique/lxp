import toast from "react-hot-toast";
import useHttp from "../../../hooks/use-http";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { PaginatedResponse } from "../../../api-queries/pagination.api";

/**
 * Custom hook pour gérer les actions groupées sur les groupes :
 * - Gestion de la suppression multiple
 *
 * @param idsList - Tableau d'identifiants des groupes
 * @param onRefreshData - Fonction pour rafraîchir les données après une action
 */
function useGroupActions(
  idsList: string[],
  onRefreshData: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<NoInfer<PaginatedResponse<unknown>>, Error>>,
) {
  const { sendRequest } = useHttp(true);

  const handleDeleteSelectedGroups = async () => {
    const applyData = () => {
      toast.success("Les groupes ont bien été supprimés avec succès");
      onRefreshData();
    };
    const queryIds = idsList.join(",");

    await sendRequest(
      { path: `/group/deleteMany/?ids=${queryIds}`, method: "delete" },
      applyData,
    );
  };

  return { onDeleteSelectedGroups: handleDeleteSelectedGroups };
}

export default useGroupActions;

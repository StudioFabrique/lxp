import toast from "react-hot-toast";
import useHttp from "../../../hooks/use-http";

/**
 * Custom hook pour gérer les actions groupées sur les groupes :
 * - Gestion de la suppression multiple
 *
 * @param idsList - Tableau d'identifiants des groupes
 * @param onRefreshData - Fonction pour rafraîchir les données après une action
 */
function useRoleActions(idsList: string[], onRefreshData: () => Promise<void>) {
  const { sendRequest } = useHttp(true);

  const handleDeleteSelectedRoles = async () => {
    const applyData = () => {
      toast.success("Les groupes ont bien été supprimés avec succès");
      onRefreshData();
    };
    const queryIds = idsList.join(",");

    await sendRequest(
      {
        path: `/permission/roles/?ids=${queryIds}`,
        method: "delete",
      },
      applyData,
    );
  };

  return { onDeleteSelectedRoles: handleDeleteSelectedRoles };
}

export default useRoleActions;

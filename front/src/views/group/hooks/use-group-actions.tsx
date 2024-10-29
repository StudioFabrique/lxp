import toast from "react-hot-toast";
import useHttp from "../../../hooks/use-http";

function useGroupActions(
  idsList: string[],
  onRefreshData: () => Promise<void>,
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

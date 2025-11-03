import { useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
import Loader from "../../UI/loader";
import Parcours from "../../../utils/interfaces/parcours";
import JournalTree from "./journal-tree";

const Journal = () => {
  const { sendRequest, isLoading } = useHttp();

  const [parcours, setParcours] = useState<Parcours[]>([]);

  useEffect(() => {
    const applyData = (data: { data: Parcours[] }) => {
      setParcours(data.data ?? []);
    };

    sendRequest({ path: "/user/my-accomplishment" }, applyData);
  }, [sendRequest]);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-bold">Mon historique d'accomplissements</h3>

      {isLoading ? (
        <Loader />
      ) : parcours.length > 0 ? (
        <JournalTree parcoursList={parcours} />
      ) : (
        <p className="p-4">Aucune entrée</p>
      )}
    </div>
  );
};

export default Journal;

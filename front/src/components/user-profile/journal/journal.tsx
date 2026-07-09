import { useEffect, useState } from "react";
import apiClient from "../../../lib/axios";
import Loader from "../../loaders/Loader";
import Parcours from "../../../utils/interfaces/parcours";
import JournalTree from "./journal-tree";

const Journal = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [parcours, setParcours] = useState<Parcours[]>([]);

  useEffect(() => {
    setIsLoading(true);
    apiClient
      .get("/user/my-accomplishment")
      .then((response) => setParcours(response.data.data ?? []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

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

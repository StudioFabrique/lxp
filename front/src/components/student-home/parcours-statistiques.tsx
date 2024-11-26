import useHttp from "../../hooks/use-http";
import { useEffect, useState } from "react";

interface ParcoursStats {
  diplome: string;
  totalWeeks: number;
  totalHours: number;
  totalModules: number;
}

/**
 * composant qui affiche les statistiques du parcours de formation
 * - Niveau d'études
 * - durée en semaines
 * - durée en heures
 * - nombre de modules
 */
const ParcoursStatistiques = ({ parcoursId }: { parcoursId: number }) => {
  const { sendRequest } = useHttp(true);
  const [stats, setStats] = useState<ParcoursStats>();

  useEffect(() => {
    console.log({ parcoursId });
    const applyData = (data: { data: ParcoursStats }) => {
      console.log({ stats: data.data });
      setStats(data.data);
    };

    sendRequest({ path: `/stats/parcours/${parcoursId}` }, applyData);
  }, [sendRequest, parcoursId]);

  return (
    <div className="text-primary grid grid-rows-4 gap-2">
      <span className="flex flex-col justify-center items-center bg-secondary text-secondary-content rounded-lg p-2">
        <p>Diplôme</p>
        <p className="font-bold text-lg">{stats?.diplome || "-"}</p>
      </span>
      <span className="flex flex-col justify-center items-center bg-secondary text-secondary-content rounded-lg p-2">
        <p>Semaine</p>
        <p className="font-bold text-lg">{stats?.totalWeeks || "-"}</p>
      </span>
      <span className="flex flex-col justify-center items-center bg-secondary text-secondary-content rounded-lg p-2">
        <p>Heure</p>
        <p className="font-bold text-lg">{stats?.totalHours || "-"}</p>
      </span>
      <span className="flex flex-col justify-center items-center bg-secondary text-secondary-content rounded-lg p-2">
        <p>Modules</p>
        <p className="font-bold text-lg">{stats?.totalModules || "-"}</p>
      </span>
    </div>
  );
};

export default ParcoursStatistiques;

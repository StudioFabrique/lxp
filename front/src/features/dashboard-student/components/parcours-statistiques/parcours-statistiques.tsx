import { useEffect, useState } from "react";
import ParcoursStatistiquesItem from "./parcours-statistiques-item";
import useHttp from "../../../../../src.legacy/hooks/use-http";

export interface ParcoursStats {
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
  const [stats, setStats] = useState<{ title: string; value: string }[]>();

  useEffect(() => {
    const applyData = (data: { data: ParcoursStats }) => {
      const parcoursStats = data.data;
      setStats([
        { title: "Diplôme", value: `Niveau ${parcoursStats?.diplome}` },
        { title: "Semaines", value: String(parcoursStats?.totalWeeks) },
        { title: "Heures", value: String(parcoursStats?.totalHours) },
        { title: "Modules", value: String(parcoursStats?.totalModules) },
      ]);
    };

    sendRequest({ path: `/stats/parcours/${parcoursId}` }, applyData);
  }, [sendRequest, parcoursId]);

  return (
    <div className="text-primary grid grid-rows-4 gap-2 w-[10%]">
      {stats?.map((stat) => (
        <ParcoursStatistiquesItem
          key={stat.title}
          title={stat.title}
          value={stat.value}
        />
      ))}
    </div>
  );
};

export default ParcoursStatistiques;

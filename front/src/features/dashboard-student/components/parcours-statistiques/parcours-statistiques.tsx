import ParcoursStatistiquesItem from "./parcours-statistiques-item";
import { useQuery } from "@tanstack/react-query";
import { dashboardStudentApi } from "../../api/dashboard-student.api";

const ParcoursStatistiques = ({ parcoursId }: { parcoursId: number }) => {
  const { data: parcoursStats } = useQuery({
    queryKey: ["parcours-stats", parcoursId],
    queryFn: () => dashboardStudentApi.queries.getParcoursStats(parcoursId),
  });

  const stats = parcoursStats
    ? [
        { title: "Diplôme", value: `Niveau ${parcoursStats.diplome}` },
        { title: "Semaines", value: String(parcoursStats.totalWeeks) },
        { title: "Heures", value: String(parcoursStats.totalHours) },
        { title: "Modules", value: String(parcoursStats.totalModules) },
      ]
    : undefined;

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

import { useContext } from "react";
import { convertMilisToWeeks } from "../../../helpers/date-helpers";
import QuickStatItem from "./quick-stat-item";
import { useParams } from "react-router";
import { useParcoursModules } from "../../../hooks/useParcoursModules";
import { useParcoursQuery } from "../../../hooks/useParcoursQuery";
import { AuthContext } from "../../../../../store/AuthProvider";
import { getModulesLabel } from "../../../../../utils/helpers/user-role";

type QuickStatistiquesProps = {
  studentCount?: number;
};

const QuickStatistiques = ({ studentCount }: QuickStatistiquesProps) => {
  const { id } = useParams();
  const parcoursId = Number(id);
  const { modules } = useParcoursModules(parcoursId);
  const { data: parcours } = useParcoursQuery(parcoursId);
  const { user } = useContext(AuthContext);

  const modulesHourSum = () => {
    let hours: number = 0;
    modules?.forEach((module) => {
      hours += module.duration;
    });
    return hours;
  };

  const parcoursWeeks = () => {
    if (!parcours?.endDate || !parcours?.startDate) {
      return 0;
    }

    const weeks = Math.floor(
      convertMilisToWeeks(
        new Date(parcours.endDate).getTime() -
          new Date(parcours.startDate).getTime(),
      ),
    );

    return weeks || 0;
  };

  return (
    <div className="grid grid-cols-2 lg:flex justify-between gap-5">
      <QuickStatItem
        title="Diplôme"
        item={`Niveau ${parcours?.formation.level}`}
      />
      <QuickStatItem title="Étudiants" item={studentCount || "-"} />
      <QuickStatItem
        title={getModulesLabel(user)}
        item={modules?.length || 0}
      />
      <QuickStatItem title="Semaines" item={parcoursWeeks()} />
      <QuickStatItem title="Heures" item={modulesHourSum()} />
    </div>
  );
};

export default QuickStatistiques;

import { useParcoursSelector } from "../../../store/ParcoursContext";
import Module from "../../../../../../src/utils/interfaces/module";
import { convertMilisToWeeks } from "../../../helpers/date-helpers";
import QuickStatItem from "./quick-stat-item";

type QuickStatistiquesProps = {
  studentCount?: number;
};

const QuickStatistiques = ({ studentCount }: QuickStatistiquesProps) => {
  const parcoursInfos = useParcoursSelector(
    (state) => state.parcoursInformations.infos,
  );

  const formation = useParcoursSelector((state) => state.parcours.formation);

  const modules = useParcoursSelector(
    (state) => state.parcoursModules.modules,
  ) as Module[];

  const modulesHourSum = () => {
    let hours: number = 0;
    modules?.forEach((module) => {
      hours += module.duration;
    });
    return hours;
  };

  const parcoursWeeks = () => {
    if (!parcoursInfos?.endDate || !parcoursInfos?.startDate) {
      return 0;
    }

    const weeks = Math.floor(
      convertMilisToWeeks(
        new Date(parcoursInfos.endDate).getTime() -
          new Date(parcoursInfos.startDate).getTime(),
      ),
    );

    return weeks || 0;
  };

  return (
    <div className="grid grid-cols-2 lg:flex justify-between gap-5">
      <QuickStatItem title="Diplôme" item={`Niveau ${formation?.level}`} />
      <QuickStatItem title="Étudiants" item={studentCount || "-"} />
      <QuickStatItem title="Modules" item={modules?.length || 0} />
      <QuickStatItem title="Semaines" item={parcoursWeeks()} />
      <QuickStatItem title="Heures" item={modulesHourSum()} />
    </div>
  );
};

export default QuickStatistiques;

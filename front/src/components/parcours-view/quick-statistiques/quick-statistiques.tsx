/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import Module from "../../../utils/interfaces/module";
import { convertMilisToWeeks } from "../../../utils/dates";
import QuickStatItem from "./quick-stat-item";

type QuickStatistiquesProps = {
  studentCount?: number;
};

const QuickStatistiques = ({ studentCount }: QuickStatistiquesProps) => {
  const parcoursInfos = useSelector(
    (state: any) => state.parcoursInformations.infos,
  );

  console.log({ parcoursInfos });

  const formation = useSelector((state: any) => state.parcours.formation);

  const modules = useSelector(
    (state: any) => state.parcoursModules.modules,
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
    <div className="flex justify-center gap-y-5 gap-x-10 text-primary-content">
      <QuickStatItem title="Diplôme" item={`Bac +${formation?.level}`} />
      <QuickStatItem title="Étudiants" item={studentCount || "-"} />
      <QuickStatItem title="Semaines" item={parcoursWeeks()} />
      <QuickStatItem title="Heures" item={modulesHourSum()} />
    </div>
  );
};

export default QuickStatistiques;

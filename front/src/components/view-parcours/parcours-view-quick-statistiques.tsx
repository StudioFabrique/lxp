import { useSelector } from "react-redux";
import Module from "../../utils/interfaces/module";
import { convertMilisToWeeks } from "../../utils/dates";

const ParcoursViewQuickStatistiques = () => {
  const parcoursInfos = useSelector(
    (state: any) => state.parcoursInformations.infos
  );

  const formation = useSelector((state: any) => state.parcours.formation);

  const modules = useSelector(
    (state: any) => state.parcoursModules.modules
  ) as Module[];

  const modulesHourSum = () => {
    let hours: number = 0;
    modules?.forEach((module) => {
      hours += module.duration;
    });
    return hours;
  };

  const parcoursWeeks = () => {
    const weeks = Math.floor(
      convertMilisToWeeks(
        new Date(parcoursInfos.endDate).getTime() -
          new Date(parcoursInfos.startDate).getTime()
      )
    );

    return weeks;
  };

  return (
    <div className="grid lg:grid-cols-5 gap-y-5 gap-x-10 mt-5 text-primary">
      <div className="flex flex-col gap-y-5 items-center bg-secondary p-10 rounded-lg">
        <p className="font-bold text-xl">Diplôme</p>
        <p className="font-bold text-4xl whitespace-nowrap">
          {formation?.level}
        </p>
      </div>
      <div className="flex flex-col gap-y-5 items-center bg-secondary p-10 rounded-lg">
        <p className="font-bold text-xl">Étudiants</p>
        <p className="font-bold text-4xl">19</p>
      </div>
      <div className="flex flex-col gap-y-5 items-center bg-secondary p-10 rounded-lg">
        <p className="font-bold text-xl">Semaines</p>
        <p className="font-bold text-4xl">{parcoursWeeks()}</p>
      </div>
      <div className="flex flex-col gap-y-5 items-center bg-secondary p-10 rounded-lg">
        <p className="font-bold text-xl">Heures</p>
        <p className="font-bold text-4xl">{modulesHourSum()}</p>
      </div>
      <div className="flex flex-col gap-y-5 items-center bg-secondary p-10 rounded-lg">
        <p className="font-bold text-xl">Modalité</p>
        <p className="font-bold text-4xl">Hybride</p>
      </div>
    </div>
  );
};

export default ParcoursViewQuickStatistiques;

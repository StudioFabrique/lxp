import { useSelector } from "react-redux";
import Module from "../../utils/interfaces/module";
import { convertMilisToWeeks } from "../../utils/dates";

/**
 * composant qui affiche les statistiques du parcours de formation
 * - Niveau d'études
 * - durée en semaines
 * - durée en heures
 * - nombre de modules
 */
const ParcoursStatistiques = () => {
  const parcoursInfos = useSelector(
    (state: any) => state.parcoursInformations.infos,
  );

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
    const weeks = Math.floor(
      convertMilisToWeeks(
        new Date(parcoursInfos.endDate).getTime() -
          new Date(parcoursInfos.startDate).getTime(),
      ),
    );

    return weeks;
  };

  return (
    <div className="text-primary grid grid-rows-4 gap-2">
      <span className="flex flex-col justify-center items-center bg-secondary text-secondary-content rounded-lg p-2">
        <p>Diplôme</p>
        <p className="font-bold text-lg">Bac +3</p>
      </span>
      <span className="flex flex-col justify-center items-center bg-secondary text-secondary-content rounded-lg p-2">
        <p>Semaine</p>
        <p className="font-bold text-lg">12</p>
      </span>
      <span className="flex flex-col justify-center items-center bg-secondary text-secondary-content rounded-lg p-2">
        <p>Heure</p>
        <p className="font-bold text-lg">457</p>
      </span>
      <span className="flex flex-col justify-center items-center bg-secondary text-secondary-content rounded-lg p-2">
        <p>Modules</p>
        <p className="font-bold text-lg">8</p>
      </span>
    </div>
  );
};

export default ParcoursStatistiques;

import { useContext } from "react";
import { Context } from "../../../store/context.store";
import QuestionMarkTooltip from "../../UI/question-mark-tooltip/question-mark-tooltip";

type RadioSelectTimelineProps = {
  showAllCourses: boolean;
  setShowAllCourses: React.Dispatch<React.SetStateAction<boolean>>;
};

const RadioSelectTimeline = ({
  showAllCourses,
  setShowAllCourses,
}: RadioSelectTimelineProps) => {
  const { roles } = useContext(Context);

  /* Section réservée aux administrateurs (rang 1) */
  /* Contrôles radio pour basculer l'affichage de tous les cours ou affectés pour les formateurs */
  return (
    roles.some((role) => role.rank === 1) && (
      <div className="flex gap-10">
        <div className="flex items-center gap-2">
          <h3>Afficher tous les cours</h3>
          <QuestionMarkTooltip
            tooltipValue="Les cours affichés par défaut sont ceux affectés à vous en tant qu'équipe pédagogique.
                      Vous avez la possibilité d'afficher tous les cours en tant qu'administrateur."
          />
        </div>
        <div className="flex gap-4">
          <label className="label cursor-pointer">
            <span className="label-text mr-2">Non</span>
            <input
              type="radio"
              name="show-all"
              className="radio radio-primary"
              checked={!showAllCourses}
              onChange={() => setShowAllCourses(false)}
            />
          </label>
          <label className="label cursor-pointer">
            <span className="label-text mr-2">Oui</span>
            <input
              type="radio"
              name="show-all"
              className="radio radio-primary"
              checked={showAllCourses}
              onChange={() => setShowAllCourses(true)}
            />
          </label>
        </div>
      </div>
    )
  );
};

export default RadioSelectTimeline;

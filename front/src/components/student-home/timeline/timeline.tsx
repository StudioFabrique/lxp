// Import des composants et du hook personnalisé
import BigCalendarTimeline from "../../UI/big-calendar-timeline/big-calendar-timeline";
import QuestionMarkTooltip from "../../UI/question-mark-tooltip/question-mark-tooltip";
import useTimeline from "./useTimeline";

const Timeline = () => {
  // Utilisation du hook personnalisé pour gérer l'état et la logique du calendrier
  const {
    roles,
    currentView,
    setCurrentView,
    showAllCourses,
    setShowAllCourses,
    timelineData,
    modulesColor,
    handleRangeChange,
    handleDoubleClickEvent,
  } = useTimeline();

  return timelineData ? (
    <div className="flex flex-col gap-5">
      <h2 className="text-base-content font-bold text-xl">
        Mon emploi du temps
      </h2>

      {/* Section réservée aux administrateurs (rank 1) */}
      {/* Contrôles radio pour basculer l'affichage de tous les cours ou affectés pour les formateurs */}
      {roles.some((role) => role.rank === 1) && (
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
      )}

      {/* Composant principal du calendrier */}
      <BigCalendarTimeline
        view={currentView}
        onSetView={setCurrentView}
        data={timelineData}
        colors={modulesColor}
        onRangeChange={handleRangeChange}
        onDoubleClickEvent={handleDoubleClickEvent}
      />
    </div>
  ) : (
    // Message affiché si aucune donnée n'est disponible
    <p className="pl-4">Aucune données du calendrier disponible</p>
  );
};

export default Timeline;

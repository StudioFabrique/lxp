// Import des composants et du hook personnalisé
import BigCalendarTimeline from "../../UI/big-calendar-timeline/big-calendar-timeline";
import RadioSelectTimeline from "./radio-select-timeline";
import useTimeline from "./useTimeline";

const Timeline = () => {
  // Utilisation du hook personnalisé pour gérer l'état et la logique du calendrier
  const {
    currentView,
    setCurrentView,
    showAllCourses,
    setShowAllCourses,
    timelineData,
    // modulesColor,
    handleRangeChange,
    handleDoubleClickEvent,
  } = useTimeline();

  return timelineData ? (
    <div className="flex flex-col gap-5">
      <h2 className="text-base-content font-bold text-xl">
        Mon emploi du temps
      </h2>

      <RadioSelectTimeline
        showAllCourses={showAllCourses}
        setShowAllCourses={setShowAllCourses}
      />
      {/* Composant principal du calendrier */}
      <BigCalendarTimeline
        view={currentView}
        onSetView={setCurrentView}
        data={timelineData}
        // colors={modulesColor}
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

// Import des composants et du hook personnalisé
import { View } from "react-big-calendar";
import BigCalendarTimeline from "../../UI/big-calendar-timeline/big-calendar-timeline";
import RadioSelectTimeline from "./radio-select-timeline";
import useTimeline from "./useTimeline";

type TimelineProps = {
  title?: string;
  viewType?: View;
};

const Timeline = ({
  title = "Mon emploi du temps",
  viewType = "work_week",
}: TimelineProps) => {
  // Utilisation du hook personnalisé pour gérer l'état et la logique du calendrier
  const {
    currentView,
    setCurrentView,
    showAllCourses,
    setShowAllCourses,
    timelineData,
    handleRangeChange,
    handleDoubleClickEvent,
  } = useTimeline(viewType);

  return timelineData ? (
    <div className="flex flex-col gap-5">
      <h2 className="text-base-content font-bold text-xl">{title}</h2>

      <RadioSelectTimeline
        showAllCourses={showAllCourses}
        setShowAllCourses={setShowAllCourses}
      />
      {/* Composant principal du calendrier */}
      <BigCalendarTimeline
        view={currentView}
        onSetView={setCurrentView}
        data={timelineData}
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

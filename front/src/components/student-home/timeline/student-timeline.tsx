import Calendar from "../../UI/calendar/calendar";
import CalendarHeader from "../../UI/calendar/calendar-header";
import TitleWithSelector from "../../UI/calendar/components/title-with-selector";
import TimeSelector from "../../UI/calendar/components/time-selector";
import ViewSelector from "../../UI/calendar/components/view-selector";
import { useContext, useState } from "react";
import { Context } from "../../../store/context.store";
import { CalendarView } from "../../UI/calendar/calendar-configuration";

const StudentTimeline = () => {
  const { theme } = useContext(Context);
  const darkMode = theme === "dark";

  const [view, setView] = useState<CalendarView>("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  // Utilisation du hook personnalisé pour gérer l'état et la logique du calendrier
  // const {
  //   currentView,
  //   setCurrentView,
  //   showAllCourses,
  //   setShowAllCourses,
  //   timelineData,
  //   handleRangeChange,
  //   handleDoubleClickEvent,
  // } = useTimeline(viewType);

  return (
    <Calendar
      currentDate={currentDate}
      currentWeekDayVisible={false}
      events={[]}
      startHour={8}
      endHour={18}
      header={
        <CalendarHeader
          darkMode={darkMode}
          children={[
            <TitleWithSelector
              key="title-with-selector"
              currentTitle="Mon emploi du temps"
              currentDate={currentDate}
              view={view}
              darkMode={darkMode}
            />,
            <div key="view-selector" className="flex gap-2">
              <TimeSelector
                view={view}
                date={currentDate}
                setDate={setCurrentDate}
              />
              <ViewSelector
                view={view}
                setView={setView}
                allowedViews={["day", "week"]}
                darkMode={darkMode}
              />
            </div>,
          ]}
        />
      }
      view={view}
      darkMode={darkMode}
    />
  );
};

export default StudentTimeline;

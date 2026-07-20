import { useContext, useState } from "react";
import { ThemeContext } from "../../../../store/ThemeProvider";
import { CalendarView } from "../../../calendar/components/calendar-configuration";
import Calendar from "../../../calendar/components/calendar";
import CalendarHeader from "../../../calendar/components/calendar-header";
import TitleWithSelector from "../../../calendar/components/components/title-with-selector";
import TimeSelector from "../../../calendar/components/components/time-selector";
import ViewSelector from "../../../calendar/components/components/view-selector";

const StudentTimeline = () => {
  const { theme } = useContext(ThemeContext);
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

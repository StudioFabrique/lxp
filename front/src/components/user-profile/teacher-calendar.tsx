import { useContext, useState } from "react";
import { Context } from "../../store/context.store";
import { CalendarView } from "../UI/calendar/calendar-configuration";
import Calendar from "../UI/calendar/calendar";
import CalendarHeader from "../UI/calendar/calendar-header";
import TitleWithSelector from "../UI/calendar/components/title-with-selector";
import TimeSelector from "../UI/calendar/components/time-selector";
import ViewSelector from "../UI/calendar/components/view-selector";

const TeacherCalendar = () => {
  const { theme } = useContext(Context);
  const darkMode = theme === "dark";

  const [view, setView] = useState<CalendarView>("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-base-content font-bold text-xl">
        Mon emploi du temps
      </h2>
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
                currentTitle="Développeur Web"
                availableTitles={["test", "test 1"]}
                onSelectTitle={() => {}}
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
                  allowedViews={["day", "week", "month"]}
                  darkMode={darkMode}
                />
              </div>,
            ]}
          />
        }
        view={view}
        darkMode={darkMode}
      />
    </div>
  );
};

export default TeacherCalendar;

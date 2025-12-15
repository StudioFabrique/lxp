import { useContext, useState } from "react";
import Calendar from "../../components/UI/calendar/calendar";
import Header from "../../components/UI/header";
import CalendarHeader from "../../components/UI/calendar/calendar-header";
import { Context } from "../../store/context.store";
import {
  CalendarEvent,
  // CalendarEvent,
  CalendarView,
} from "../../components/UI/calendar/calendar-configuration";
import TitleWithSelector from "../../components/UI/calendar/components/title-with-selector";
import ViewSelector from "../../components/UI/calendar/components/view-selector";
import TimeSelector from "../../components/UI/calendar/components/time-selector";

const myEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "HTML & Sémantique Web",
    subtitle: "Cours",
    date: new Date(2025, 11, 4),
    start: "08:30",
    end: "12:00",
    type: "primary",
  },
  {
    id: 2,
    title: "CSS et Design Web Responsive",
    subtitle: "Cours",
    date: new Date(2025, 11, 4),
    start: "13:30",
    end: "16:30",
    type: "secondary",
  },
  {
    id: 3,
    title: "Versionnement avec Git & GitHub",
    subtitle: "Cours",
    date: new Date(2025, 11, 5),
    start: "08:30",
    end: "12:00",
    type: "neutral",
  },
  {
    id: 4,
    title: "JavaScript Moderne (ES6+)",
    subtitle: "Cours",
    date: new Date(2025, 11, 5),
    start: "13:0",
    end: "14:30",
    type: "danger",
  },
  {
    id: 5,
    title: "UI/UX : Conception d'Interfaces Utilisateur",
    subtitle: "Cours",
    date: new Date(2025, 11, 5),
    start: "14:30",
    end: "17:00",
    type: "accent",
  },
];

const CalendarHome = () => {
  const { theme } = useContext(Context);
  const darkMode = theme === "dark";

  const [view, setView] = useState<CalendarView>("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="w-full flex flex-col gap-6">
      <Header
        title="Calendrier"
        description="Consulter le calendrier des prochains cours."
      />
      <Calendar
        currentDate={currentDate}
        currentWeekDayVisible={false}
        events={myEvents}
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

export default CalendarHome;

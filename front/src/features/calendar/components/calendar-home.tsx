import { useContext, useState } from "react";
import Calendar from "./calendar";
import Header from "../../../components/headers/Header";
import CalendarHeader from "./calendar-header";
import { ThemeContext } from "../../../store/ThemeProvider";
import {
  CalendarEvent,
  // CalendarEvent,
  CalendarView,
} from "./calendar-configuration";
import TitleWithSelector from "./components/title-with-selector";
import ViewSelector from "./components/view-selector";
import TimeSelector from "./components/time-selector";
import EventDetailsModal from "./components/event-details-modal";
import { Link } from "react-router";

const calendarTestEvents: CalendarEvent[] = [
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
  const { theme } = useContext(ThemeContext);
  const darkMode = theme === "dark";

  const [view, setView] = useState<CalendarView>("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CalendarEvent>();

  const handleShowCourseDetails = (id: number | string) => {
    setShowModal(true);
    setSelectedCourse(calendarTestEvents.find((item) => item.id === id));
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <Header
        title="Calendrier"
        description="Consulter le calendrier des prochains cours."
      />
      <Calendar
        currentDate={currentDate}
        currentWeekDayVisible={false}
        events={calendarTestEvents}
        onClickEventDetails={handleShowCourseDetails}
        startHour={8}
        endHour={18}
        header={
          <CalendarHeader
            darkMode={darkMode}
            children={[
              <TitleWithSelector
                key="title-with-selector"
                currentTitle="Mon emploi du temps"
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
      <EventDetailsModal
        modalId="event-details-modal"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        item={
          selectedCourse && {
            id: selectedCourse.id,
            title: selectedCourse.title,
            description: selectedCourse.subtitle,
            img: "https://img.freepik.com/vecteurs-premium/www-concept-illustration_114360-2143.jpg",
          }
        }
      >
        <Link
          to={`/student/parcours/module/1`}
          className="btn btn-primary text-white"
        >
          Naviguer vers le cours
        </Link>
      </EventDetailsModal>
    </div>
  );
};

export default CalendarHome;

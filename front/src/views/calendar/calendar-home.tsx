import NewCalendarTimeline, {
  CalendarEvent,
} from "../../components/student-home/timeline/new-calendar-timeline";
import Header from "../../components/UI/header";

const myEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "HTML & Sémantique Web",
    subtitle: "Cours",
    dayIndex: 0,
    start: "08:30",
    end: "10:00",
    type: "primary",
  },
  {
    id: 2,
    title: "CSS et Design Web Responsive",
    subtitle: "Cours",
    dayIndex: 0,
    start: "10:30",
    end: "12:30",
    type: "secondary",
  },
  {
    id: 3,
    title: "Versionnement avec Git & GitHub",
    subtitle: "Cours",
    dayIndex: 0,
    start: "12:30",
    end: "13:30",
    type: "neutral",
  },
  {
    id: 4,
    title: "JavaScript Moderne (ES6+)",
    subtitle: "Cours",
    dayIndex: 1,
    start: "14:15",
    end: "16:00",
    type: "danger",
  },
  {
    id: 5,
    title: "UI/UX : Conception d'Interfaces Utilisateur",
    subtitle: "Cours",
    dayIndex: 2,
    start: "8:30",
    end: "12:00",
    type: "accent",
  },
];

const CalendarHome = () => {
  return (
    <div className="w-full flex flex-col gap-6">
      <Header
        title="Calendrier"
        description="Consulter le calendrier des prochains cours."
      />
      <NewCalendarTimeline
        title="Développeur Web"
        events={myEvents}
        startHour={8}
        endHour={18}
        defaultView="week"
      />
    </div>
  );
};

export default CalendarHome;

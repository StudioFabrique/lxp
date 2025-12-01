import Timeline from "../../components/student-home/timeline/timeline";
import Header from "../../components/UI/header";

const CalendarHome = () => {
  return (
    <div className="w-full flex flex-col gap-6">
      <Header
        title="Calendrier"
        description="Consulter le calendrier des prochains cours."
      />
      <Timeline title="Mon emploi du temps pour cette semaine" />
    </div>
  );
};

export default CalendarHome;

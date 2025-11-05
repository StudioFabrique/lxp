import Timeline from "../../components/student-home/timeline/timeline";
import Header from "../../components/UI/header";
import ViewWrapper from "../../components/UI/wrapper/view-wrapper";

const CalendarHome = () => {
  return (
    <ViewWrapper className="flex flex-col gap-6">
      <Header
        title="Calendrier"
        description="Consulter le calendrier des prochains cours."
      />
      <Timeline title="Mon emploi du temps pour cette semaine" />
    </ViewWrapper>
  );
};

export default CalendarHome;

import ParcoursHeader from "../../components/groups-header/groups-header.component";
import ParcoursForm from "../../components/parcours-form/parcours-form.component";
import Skills from "../../components/skills/skills.component";
import CanAccessPage from "../../components/UI/can/can-access-page.component";

const ParcoursAdd = () => {
  return (
    <CanAccessPage action="write" subject="parcours">
      <div className="w-full flex h-screen flex-col items-center px-4 py-8 gap-8">
        <ParcoursHeader />
        <ParcoursForm />
        <Skills />
      </div>
    </CanAccessPage>
  );
};

export default ParcoursAdd;

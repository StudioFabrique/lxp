import ParcoursHeader from "../../components/groups-header/groups-header.component";
import ParcoursForm from "../../components/parcours-form/parcours-form.component";

const ParcoursAdd = () => {
  return (
    <div className="w-full flex h-screen flex-col items-center px-4 py-8 gap-8">
      <ParcoursHeader />
      <ParcoursForm />
    </div>
  );
};

export default ParcoursAdd;

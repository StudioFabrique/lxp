import useParcours from "../../hooks/use-parcours";
import { useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import ParcoursInfos from "../parcours-infos/parcours-infos.component";
import DatesSelecter from "../UI/dates-selecter/dates-selecter.component";
import Tags from "../UI/tags/tags.component";
import ParcoursRessourcesContacts from "../parcours-ressources-contacts/parcours-ressources-contacts.component";
import { DrawerProvider } from "../../store/drawer.store";

const ParcoursForm = () => {
  const { formInfos, updateInfos, updateDates, updateTags, updateContacts } =
    useParcours();
  /*   const [infos] = useState(
    useMemo(() => {
      return {
        data: formInfos,
      };
    }, [formInfos])
  ); */

  console.log("rendering");

  console.log({ formInfos });

  useEffect(() => {
    setTimeout(() => {
      toast.success("Mise à jour des données réussie!");
    }, 3000);
  }, [formInfos]);

  return (
    <>
      <Toaster />
      <div className="w-full grid auto-cols-max grid-cols-1 lg:grid-cols-3 gap-y-8 gap-x-4">
        <div>
          <ParcoursInfos onSubmitInformations={updateInfos} />
        </div>
        <div className="flex flex-col gap-y-4">
          <DatesSelecter onSubmitDates={updateDates} />
          <Tags onSubmitTags={updateTags} />
        </div>
        <div>
          <DrawerProvider>
            <ParcoursRessourcesContacts onSubmitContacts={updateContacts} />
          </DrawerProvider>
        </div>
      </div>
    </>
  );
};

export default ParcoursForm;

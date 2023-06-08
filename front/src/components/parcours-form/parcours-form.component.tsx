import useParcours from "../../hooks/use-parcours";
import { useEffect, useMemo, useState } from "react";
import MemoizedParcoursInfo from "../parcours-infos/parcours-infos.component";
import MemoizedDatesSelecter from "../UI/dates-selecter/dates-selecter.component";
import MemoizedParcoursRessourcesContacts from "../parcours-ressources-contacts/parcours-ressources-contacts.component";
import MemoizedTagsComponent from "../UI/tags/tags.component";
import Portal from "../UI/portal/portal";
import { Toaster, toast } from "react-hot-toast";

const ParcoursForm = () => {
  const { formInfos, updateInfos, updateDates, updateTags, updateContacts } =
    useParcours();
  const [infos] = useState(
    useMemo(() => {
      return {
        data: formInfos,
      };
    }, [formInfos])
  );

  console.log("rendering");

  console.log({ formInfos });

  useEffect(() => {
    setTimeout(() => {
      toast.success("Mise à jour des données réussie!");
    }, 3000);
  }, [infos.data]);

  return (
    <>
      <Portal>
        <Toaster />
      </Portal>
      <div className="w-full grid auto-cols-max grid-cols-1 lg:grid-cols-3 gap-y-8 gap-x-4">
        <div>
          <MemoizedParcoursInfo onSubmitInformations={updateInfos} />
        </div>
        <div className="flex flex-col gap-y-4">
          <MemoizedDatesSelecter onSubmitDates={updateDates} />
          <MemoizedTagsComponent onSubmitTags={updateTags} />
        </div>
        <div>
          <MemoizedParcoursRessourcesContacts
            onSubmitContacts={updateContacts}
          />
        </div>
      </div>
    </>
  );
};

export default ParcoursForm;

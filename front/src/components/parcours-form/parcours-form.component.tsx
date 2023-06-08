import useParcours from "../../hooks/use-parcours";
import { useEffect, useMemo, useState } from "react";
import MemoizedParcoursInfo from "../parcours-infos/parcours-infos.component";
import MemoizedDatesSelecter from "../UI/dates-selecter/dates-selecter.component";
import MemoizedParcoursRessourcesContacts from "../parcours-ressources-contacts/parcours-ressources-contacts.component";
import MemoizedTagsComponent from "../UI/tags/tags.component";
import Toast from "../UI/toast/toast.component";

let message: string;
let type: string;

const ParcoursForm = () => {
  const { formInfos, updateInfos, updateDates, updateTags, updateContacts } =
    useParcours();
  const [loading, setIsLoading] = useState(false);
  const [infos] = useState(
    useMemo(() => {
      return {
        data: formInfos,
      };
    }, [formInfos])
  );
  const [toast, setToast] = useState(false);

  console.log("rendering");

  console.log({ formInfos });

  useEffect(() => {
    setIsLoading(true);
    type = "info";
    message = "mise à jour des modifications en cours...";
    setTimeout(() => {
      setIsLoading(false);
      setToast(true);
      setTimeout(() => {
        setToast(false);
      }, 2000);
    }, 3000);
  }, [infos.data]);

  return (
    <>
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
      {loading ? <Toast message={message} type={type} /> : null}
      {toast ? (
        <Toast
          message="Mise à jour des modifications réussie!"
          type="success"
        />
      ) : null}
    </>
  );
};

export default ParcoursForm;

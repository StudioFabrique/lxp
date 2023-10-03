import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";

import ParcoursInfos from "../parcours-infos/parcours-infos.component";
import DatesSelecter from "../UI/dates-selecter/dates-selecter.component";
import Tags from "../UI/tags/tags.component";
import ParcoursRessourcesContacts from "../parcours-ressources-contacts/parcours-ressources-contacts.component";
import { DrawerProvider } from "../../store/drawer.store";
import { parcoursAction } from "../../store/redux-toolkit/parcours";
import useHttp from "../../hooks/use-http";
import Tag from "../../utils/interfaces/tag";
import Role from "../../utils/interfaces/role";

type UserItem = {
  _id: string;
  name: string;
  roles: Array<Role>;
};

const ParcoursForm = () => {
  const dispatch = useDispatch();
  const parcoursInfos = useSelector((state: any) => state.parcours.infos);
  const isValid = useSelector((state: any) => state.parcours.parcoursIsValid);
  const { sendRequest } = useHttp();

  // Callback pour soumettre les informations du parcours
  const submitInfos = useCallback(
    (infos: any) => {
      dispatch(parcoursAction.updateParcoursInfos(infos));
    },
    [dispatch]
  );

  // Callback pour soumettre les dates du parcours
  const submitDates = useCallback(
    (dates: { startDate: string; endDate: string }) => {
      dispatch(parcoursAction.updateParcoursDates(dates));
    },
    [dispatch]
  );

  // Callback pour soumettre les tags du parcours
  const submitTags = useCallback(
    (tags: Array<Tag>) => {
      dispatch(parcoursAction.updateParcoursTags(tags));
    },
    [dispatch]
  );

  // Callback pour soumettre les contacts du parcours
  const submitContacts = useCallback(
    (contacts: Array<UserItem>) => {
      dispatch(parcoursAction.updateParcoursContacts(contacts));
    },
    [dispatch]
  );

  // Envoie les informations du parcours au serveur lorsque le formulaire est valide
  useEffect(() => {
    // Traîtement de la réponse
    const applyData = (data: any) => {
      dispatch(parcoursAction.setParcoursId(data.id));
      toast.success("Parcours mis à jour");
    };

    // Vérifie si le formulaire est valide avant d'envoyer la requête
    dispatch(parcoursAction.testParcours());

    if (isValid) {
      sendRequest(
        {
          path: "/parcours",
          method: "post",
          body: parcoursInfos,
        },
        applyData
      );
    }
  }, [parcoursInfos, isValid, sendRequest, dispatch]);

  return (
    <>
      <Toaster />
      <div className="w-full grid auto-cols-max grid-cols-1 lg:grid-cols-3 gap-y-8 gap-x-4">
        <div>
          <ParcoursInfos onSubmitInformations={submitInfos} />
        </div>
        <div className="flex flex-col gap-y-4">
          <DatesSelecter onSubmitDates={submitDates} />
          <Tags onSubmitTags={submitTags} />
        </div>
        <div>
          <DrawerProvider>
            <ParcoursRessourcesContacts onSubmitContacts={submitContacts} />
          </DrawerProvider>
        </div>
      </div>
    </>
  );
};

export default ParcoursForm;

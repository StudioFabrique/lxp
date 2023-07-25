import { FC, useCallback, useEffect, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";

import ParcoursInfos from "../parcours-infos/parcours-infos.component";
import DatesSelecter from "../UI/dates-selecter/dates-selecter.component";
import Tags from "../UI/tags/tags.component";
import ParcoursRessourcesContacts from "../parcours-ressources-contacts/parcours-ressources-contacts.component";
import { DrawerProvider } from "../../store/drawer.store";
import useHttp from "../../hooks/use-http";
import Tag from "../../utils/interfaces/tag";
import Role from "../../utils/interfaces/role";
import { parcoursInformationsAction } from "../../store/redux-toolkit/parcours/parcours-informations";

type UserItem = {
  _id: string;
  name: string;
  roles: Array<Role>;
};

type Props = {
  validateStep: (id: number, value: boolean) => void;
};

const ParcoursInformations: FC<Props> = ({ validateStep }) => {
  const dispatch = useDispatch();
  const infos = useSelector((state: any) => state.parcoursInformations.infos);
  const informationsAreValid = useSelector(
    (state: any) => state.parcoursInformations.informationsAreValid
  );
  const { sendRequest } = useHttp();
  const [tags, setTags] = useState<Array<Tag> | null>(null);
  const [selectedTags, setSelectedTags] = useState<Array<Tag>>(infos.tags);

  console.log("coucou  rendering");
  console.log({ selectedTags });

  // Callback pour soumettre les informations du parcours
  const submitInfos = useCallback(
    (infos: any) => {
      dispatch(parcoursInformationsAction.updateParcoursInfos(infos));
    },
    [dispatch]
  );

  // Callback pour soumettre les dates du parcours
  const submitDates = useCallback(
    (dates: { startDate: string; endDate: string }) => {
      dispatch(parcoursInformationsAction.updateParcoursDates(dates));
    },
    [dispatch]
  );

  // Callback pour soumettre les tags du parcours
  const submitTags = useCallback(
    (tags: Array<Tag>) => {
      dispatch(parcoursInformationsAction.updateParcoursTags(tags));
    },
    [dispatch]
  );

  // Callback pour soumettre les contacts du parcours
  const submitContacts = useCallback(
    (contacts: Array<UserItem>) => {
      dispatch(parcoursInformationsAction.updateParcoursContacts(contacts));
    },
    [dispatch]
  );

  // Envoie les informations du parcours au serveur lorsque le formulaire est valide
  const submitInformations = () => {
    // Traîtement de la réponse
    const applyData = (data: any) => {
      toast.success("Parcours mis à jour");
      dispatch(parcoursInformationsAction.testParcours());
      console.log({ informationsAreValid });

      if (informationsAreValid) {
        console.log("yay");

        validateStep(1, true);
      } else {
        console.log("oops");

        validateStep(1, false);
      }
    };

    // Vérifie si le formulaire est valide avant d'envoyer la requête
    if (infos.title.length > 0) {
      const parcours = {
        title: infos.title,
        description: infos.description,
        degree: infos.degree,
      };
      sendRequest(
        {
          path: "/parcours",
          method: "post",
          body: parcours,
        },
        applyData
      );
    }
  };

  useEffect(() => {
    console.log("yop les tags");

    if (
      tags &&
      tags.length > 0 &&
      selectedTags !== undefined &&
      selectedTags.length > 0
    ) {
      console.log({ tags });
      console.log("yo", selectedTags);

      selectedTags.forEach((item) => {
        tags.filter((subItem) => subItem.id !== item.id);
      });
    }
  }, [selectedTags, tags]);

  useEffect(() => {
    const applyData = (data: Array<Tag>) => {
      setTags(data);
    };
    sendRequest(
      {
        path: "/tag",
      },
      applyData
    );
  }, [sendRequest]);

  console.log({ infos });

  return (
    <>
      <Toaster />
      <div className="w-full grid auto-cols-max grid-cols-1 lg:grid-cols-3 gap-y-8 gap-x-4">
        <div>
          <ParcoursInfos onSubmitInformations={submitInfos} />
        </div>
        <div className="flex flex-col gap-y-4">
          <DatesSelecter
            onSubmitDates={submitDates}
            startDateProp={infos.startDate}
            endDateProp={infos.endDate}
          />
          {tags && tags.length > 0 ? (
            <>
              {selectedTags && selectedTags.length > 0 ? (
                <Tags
                  reduxTags={selectedTags}
                  unselectedTags={tags}
                  onSubmitTags={submitTags}
                />
              ) : (
                <Tags unselectedTags={tags} onSubmitTags={submitTags} />
              )}
            </>
          ) : null}
        </div>
        <div>
          <DrawerProvider>
            <ParcoursRessourcesContacts onSubmitContacts={submitContacts} />
          </DrawerProvider>
        </div>
      </div>
      <div className="w-full flex justify-end">
        <button className="btn btn-primary" onClick={submitInformations}>
          Etape suivante
        </button>
      </div>
    </>
  );
};

const MemoizedParcoursInformations = memo(ParcoursInformations);

export default MemoizedParcoursInformations;

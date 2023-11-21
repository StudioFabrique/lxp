/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import ParcoursInformationsForm from "./parcours-informations-form";
import VirtualClass from "../../virtual-class";
import useHttp from "../../../hooks/use-http";
import { parcoursInformationsAction } from "../../../store/redux-toolkit/parcours/parcours-informations";
import Wrapper from "../../UI/wrapper/wrapper.component";
import DatesSelecter from "../../UI/dates-selecter/dates-selecter.component";
import Tags from "../../UI/tags/tags.component";
import Tag from "../../../utils/interfaces/tag";
import { parcoursContactsAction } from "../../../store/redux-toolkit/parcours/parcours-contacts";
import User from "../../../utils/interfaces/user";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";
import useInput from "../../../hooks/use-input";
import { regexUrl } from "../../../utils/constantes";
import ContactsWithDrawer from "./contacts-with-drawer";
import Contact from "../../../utils/interfaces/contact";

type Props = {
  parcoursId: string;
};

const ParcoursInformations: FC<Props> = ({ parcoursId }) => {
  const [submitVirtualClass, setSubmitVirtualClass] = useState<boolean>(false);
  const [submitContacts, setSubmitContacts] = useState<boolean>(false);
  const parcoursStartDate = useSelector(
    (state: any) => state.parcoursInformations.infos.startDate
  );
  const parcoursEndDate = useSelector(
    (state: any) => state.parcoursInformations.infos.endDate
  );
  const dispatch = useDispatch();
  const { sendRequest } = useHttp();
  const tagsIsValid = useSelector(
    (state: any) => state.parcoursInformations.tagsIsValid
  );
  const contacts = useSelector(
    (state: any) => state.parcoursContacts.currentContacts
  );
  const notSelectedContacts = useSelector(
    (state: any) => state.parcoursContacts.notSelectedContacts
  );
  const isInitialRender = useRef(true);
  const { value: virtualClass } = useInput(
    (value) => regexUrl.test(value),
    useSelector(
      (state: any) => state.parcoursInformations.infos.virtualClass as string
    )
  );

  useEffect(() => {
    dispatch(parcoursContactsAction.setNotSelectedContacts());
  }, [dispatch, contacts]);

  /**
   * envoie une requête http pour récup la liste des formateurs et la stocke dans un slice redux
   */
  const fetchTeachers = useCallback(() => {
    const applyData = (data: Array<User>) => {
      dispatch(parcoursContactsAction.initContacts(data));
    };
    sendRequest(
      {
        path: "/user/contacts",
      },
      applyData
    );
  }, [dispatch, sendRequest]);

  // apple la fonction qui envoie la requete pour récupérer les formateurs
  useEffect(() => {
    if (isInitialRender.current) {
      fetchTeachers();
    } else {
      isInitialRender.current = false;
    }
  }, [fetchTeachers]);

  const updateDates = useCallback(
    (startDate: string, endDate: string) => {
      const processData = (data: { success: boolean; message: string }) => {
        if (data.success) {
          toast.success(data.message);
        }
      };
      sendRequest(
        {
          path: "/parcours/update-dates",
          method: "put",
          body: { parcoursId, startDate, endDate },
        },
        processData
      );
    },
    [parcoursId, sendRequest]
  );

  const updateContacts = useCallback(
    (updatedContacts: Contact[]) => {
      setSubmitContacts(true);
      dispatch(parcoursContactsAction.setCurrentContacts(updatedContacts));
    },
    [dispatch]
  );

  const updateTags = useCallback(
    (tags: Array<Tag>) => {
      const processData = (data: { success: boolean; message: string }) => {
        if (data.success) {
          toast.success(data.message);
        }
      };
      sendRequest(
        {
          path: "/parcours/update-tags",
          method: "put",
          body: { parcoursId, tags: tags.map((item: Tag) => item.id) },
        },
        processData
      );
    },
    [parcoursId, sendRequest]
  );

  // Callback pour soumettre les dates du parcours
  const submitDates = useCallback(
    (dates: { startDate: string; endDate: string }) => {
      dispatch(parcoursInformationsAction.updateParcoursDates(dates));
      updateDates(dates.startDate, dates.endDate);
    },
    [updateDates, dispatch]
  );

  const handleVirtualClassValue = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    if (!submitVirtualClass) {
      setSubmitVirtualClass(true);
    }
    virtualClass.valueChangeHandler(event);
  };

  // mise à jour des tags vets la base de données
  useEffect(() => {
    const processData = (data: {
      success: boolean;
      data: any;
      message: string;
    }) => {
      if (data.success) {
        toast.success(data.message);
      }
    };
    const timer = setTimeout(() => {
      if (submitContacts) {
        sendRequest(
          {
            path: "/parcours/update-contacts",
            method: "put",
            body: { parcoursId, contacts },
          },
          processData
        );
        setSubmitContacts(false);
      }
    }, autoSubmitTimer);
    return () => clearTimeout(timer);
  }, [dispatch, parcoursId, submitContacts, sendRequest, contacts]);

  useEffect(() => {
    dispatch(parcoursInformationsAction.isValid());
  }, [tagsIsValid, parcoursStartDate, parcoursEndDate, dispatch]);

  // met à jour la classe virtuelle vers la bdd
  useEffect(() => {
    const timer = setTimeout(() => {
      const formIsValid = virtualClass.isValid;
      const processData = (data: { success: boolean; message: string }) => {
        if (data.success) {
          toast.success(data.message);
        } else {
          toast.error(
            "Le lien vers la classe virtuelle n'a pas été mis à jour"
          );
        }
        dispatch(
          parcoursInformationsAction.setVirtualClass(virtualClass.value)
        );
      };
      if (formIsValid && submitVirtualClass) {
        console.log(virtualClass.value, parcoursId);

        sendRequest(
          {
            path: "/parcours/update-virtual-class",
            method: "put",
            body: { parcoursId, virtualClass: virtualClass.value },
          },
          processData
        );
        setSubmitVirtualClass(false);
      }
    }, autoSubmitTimer);

    return () => clearTimeout(timer);
  }, [
    parcoursId,
    virtualClass.value,
    virtualClass.isValid,
    submitVirtualClass,
    dispatch,
    sendRequest,
  ]);

  return (
    <div className="w-full">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8">
        <Wrapper>
          <h2 className="text-xl font-bold">Informations</h2>
          <div className="flex flex-col gap-y-8">
            <ParcoursInformationsForm parcoursId={parcoursId} />
            <DatesSelecter
              startDateProp={parcoursStartDate}
              endDateProp={parcoursEndDate}
              label="Dates de parcours"
              onSubmitDates={submitDates}
            />
            <VirtualClass
              onChangeValue={handleVirtualClassValue}
              virtualClass={virtualClass}
            />
          </div>
        </Wrapper>
        <div className="flex flex-col gap-y-8">
          {contacts ? (
            <Wrapper>
              <ContactsWithDrawer
                loading={false}
                initialList={notSelectedContacts}
                currentItems={contacts}
                property="name"
                onSubmit={updateContacts}
              />
            </Wrapper>
          ) : null}
          <Wrapper>
            <Tags onSubmitTags={updateTags} />
          </Wrapper>
        </div>
      </div>
    </div>
  );
};

export default ParcoursInformations;

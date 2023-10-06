/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import ParcoursInformationsForm from "./parcours-informations-form";
import { toast } from "react-hot-toast";
import Contacts from "./contacts";
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

type Props = {
  parcoursId?: string;
};

const ParcoursInformations: FC<Props> = ({ parcoursId = "1" }) => {
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
  const isInitialEffect = useRef(true);
  const { value: virtualClass } = useInput(
    (value) => regexUrl.test(value),
    useSelector(
      (state: any) => state.parcoursInformations.infos.virtualClass as string
    )
  );
  const isInitialVirtual = useRef(true);

  useEffect(() => {
    dispatch(parcoursContactsAction.setNotSelectedContacts());
  }, [dispatch, contacts]);

  /**
   * envoie une requête http pour récup la liste des formateurs et la stocke dans un slice redux
   */
  const fetchTeachers = useCallback(() => {
    const applyData = (data: Array<User>) => {
      const contacts = data.map((user: User) => ({
        idMdb: user._id,
        name: `${user.lastname} ${user.firstname}`,
        role: user.roles[0].label,
      }));
      dispatch(parcoursContactsAction.initContacts(contacts));
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

  useEffect(() => {
    const processData = (data: {
      success: boolean;
      data: any;
      message: string;
    }) => {
      if (data.success) {
        console.log(data);

        toast.success(data.message);
      }
    };
    let timer: any;
    if (!isInitialEffect.current) {
      timer = setTimeout(() => {
        sendRequest(
          {
            path: "/parcours/update-contacts",
            method: "put",
            body: { parcoursId, contacts },
          },
          processData
        );
      }, autoSubmitTimer);
    } else {
      isInitialEffect.current = false;
    }
    return () => clearTimeout(timer);
  }, [dispatch, parcoursId, sendRequest, contacts]);

  useEffect(() => {
    dispatch(parcoursInformationsAction.isValid());
  }, [tagsIsValid, parcoursStartDate, parcoursEndDate, dispatch]);

  useEffect(() => {
    let timer: any;
    const formIsValid = virtualClass.isValid;
    if (!isInitialVirtual.current && formIsValid) {
      timer = setTimeout(() => {
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
        sendRequest(
          {
            path: "/parcours/update-virtual-class",
            method: "put",
            body: { parcoursId, virtualClass: virtualClass.value },
          },
          processData
        );
      }, autoSubmitTimer);
    } else {
      isInitialVirtual.current = false;
    }
    return () => clearTimeout(timer);
  }, [
    parcoursId,
    virtualClass.value,
    virtualClass.isValid,
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
            <VirtualClass virtualClass={virtualClass} />
          </div>
        </Wrapper>
        <div className="flex flex-col gap-y-8">
          {contacts ? (
            <Wrapper>
              <Contacts
                contacts={contacts}
                notSelectedContacts={notSelectedContacts}
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

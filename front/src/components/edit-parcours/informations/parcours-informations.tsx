/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import ParcoursInformationsForm from "./parcours-informations-form";
import VirtualClass from "../../virtual-class";
import useHttp from "../../../hooks/use-http";
import { parcoursInformationsAction } from "../../../store/redux-toolkit/parcours/parcours-informations";
import Wrapper from "../../UI/wrapper/wrapper.component";
import DatesSelecter from "../../UI/dates-selecter/dates-selecter.component";

import Tag from "../../../utils/interfaces/tag";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";
import useInput from "../../../hooks/use-input";
import { regexUrl } from "../../../utils/constantes";
import ContactsWithDrawer from "./contacts-with-drawer";
import Contact from "../../../utils/interfaces/contact";
import TagsWithDrawer from "./tags-with-drawer";
import useInfosService from "../../../views/parcours/parcours-edit/hooks/use-infos-service";

type Props = {
  parcoursId: string;
};

const ParcoursInformations: FC<Props> = ({ parcoursId }) => {
  const [submitVirtualClass, setSubmitVirtualClass] = useState<boolean>(false);

  const parcoursStartDate = useSelector(
    (state: any) => state.parcoursInformations.infos.startDate
  );
  const parcoursEndDate = useSelector(
    (state: any) => state.parcoursInformations.infos.endDate
  );
  const dispatch = useDispatch();
  const { sendRequest, error } = useHttp();
  const {
    loadingContacts,
    loadingTags,
    updateParcoursContacts,
    updateParcoursTags,
  } = useInfosService();
  const { value: virtualClass } = useInput(
    (value) => regexUrl.test(value),
    useSelector(
      (state: any) => state.parcoursInformations.infos.virtualClass as string
    )
  );

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

  const handleUpdateContacts = useCallback(
    (updatedContacts: Contact[]) => {
      updateParcoursContacts(+parcoursId, updatedContacts);
    },
    [parcoursId, updateParcoursContacts]
  );

  /**
   * met à jour la liste des tags associés au parcours dans la bdd
   */
  const handleUpdateTags = useCallback(
    (tags: Array<Tag>) => {
      updateParcoursTags(
        +parcoursId,
        tags.map((item) => item.id)
      );
    },
    [parcoursId, updateParcoursTags]
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

  useEffect(() => {
    dispatch(parcoursInformationsAction.isValid());
  }, [parcoursStartDate, parcoursEndDate, dispatch]);

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

  // gère les erreurs HTTP
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

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
          <Wrapper>
            <ContactsWithDrawer
              loading={loadingContacts}
              onSubmit={handleUpdateContacts}
            />
          </Wrapper>
          <Wrapper>
            <TagsWithDrawer loading={loadingTags} onSubmit={handleUpdateTags} />
          </Wrapper>
        </div>
      </div>
    </div>
  );
};

export default ParcoursInformations;

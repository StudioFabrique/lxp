import { FC, useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import ParcoursInformationsForm from "./parcours-informations-form";
import VirtualClass from "../../../../../../src/components/virtual-class";
import { useParcoursSelector, useParcoursDispatch } from "../../../store/ParcoursContext";
import Wrapper from "../../../../../../src/components/wrappers/BoxWrapper";
import DatesSelecter from "../../../../../components/UI/dates-selecter/dates-selecter.component";

import Tag from "../../../../../../src/utils/interfaces/tag";
import { autoSubmitTimer } from "../../../../../config/auto-submit-timer";
import useInput from "../../../../../hooks/useInput";
import { regexUrl } from "../../../../../config/constantes";
import ContactsWithDrawer from "./contacts-with-drawer";
import Contact from "../../../../../../src/utils/interfaces/contact";
import TagsWithDrawer from "./tags-with-drawer";
import useInfosService from "../../../hooks/useInfosService";
import { useParcoursQuery } from "../../../hooks/useParcoursQuery";
import { useUpdateParcours } from "../../../hooks/useUpdateParcours";

type Props = {
  parcoursId: string;
};

const ParcoursInformations: FC<Props> = ({ parcoursId }) => {
  const numericParcoursId = Number(parcoursId);
  const { data: parcours } = useParcoursQuery(numericParcoursId);
  const { mutateAsync: updateParcours } = useUpdateParcours(numericParcoursId);
  const [submitVirtualClass, setSubmitVirtualClass] = useState<boolean>(false);

  const parcoursStartDate = parcours?.startDate ?? "";
  const parcoursEndDate = parcours?.endDate ?? "";
  const dispatch = useParcoursDispatch();
  const {
    loadingContacts,
    loadingTags,
    updateParcoursContacts,
    updateParcoursTags,
  } = useInfosService(numericParcoursId);
  const { value: virtualClass } = useInput(
    (value) => regexUrl.test(value),
    parcours?.virtualClass ?? "",
  );
  const parentTags = useParcoursSelector(
    (state) => state.tags.parentTags,
  );

  const updateDates = useCallback(
    async (startDate: string, endDate: string) => {
      try {
        const data = await updateParcours({
          startDate,
          endDate,
        });
        if (data.success) {
          toast.success(data.message);
        }
      } catch {
        toast.error("Erreur lors de la mise à jour des dates");
      }
    },
    [updateParcours],
  );

  const handleUpdateContacts = useCallback(
    (updatedContacts: Contact[]) => {
      updateParcoursContacts(
        updatedContacts.flatMap((contact) =>
          contact.id === undefined ? [] : [contact.id],
        ),
      );
    },
    [updateParcoursContacts],
  );

  /**
   * met à jour la liste des tags associés au parcours dans la bdd
   */
  const handleUpdateTags = useCallback(
    (tags: Array<Tag>) => {
      updateParcoursTags(tags.map((item) => item.id));
    },
    [updateParcoursTags],
  );

  // Callback pour soumettre les dates du parcours
  const submitDates = useCallback(
    (dates: { startDate: string; endDate: string }) => {
      dispatch({ type: "UPDATE_PARCOURS_DATES", payload: dates });
      updateDates(dates.startDate, dates.endDate);
    },
    [updateDates, dispatch],
  );

  const handleVirtualClassValue = (
    event: React.FormEvent<HTMLInputElement>,
  ) => {
    if (!submitVirtualClass) {
      setSubmitVirtualClass(true);
    }
    virtualClass.valueChangeHandler(event);
  };

  useEffect(() => {
    dispatch({ type: "VALIDATE_INFOS" });
  }, [parcoursStartDate, parcoursEndDate, dispatch]);

  // met à jour la classe virtuelle vers la bdd
  useEffect(() => {
    const timer = setTimeout(async () => {
      const formIsValid = virtualClass.isValid;
      if (formIsValid && submitVirtualClass) {
        try {
          const data = await updateParcours({
            virtualClass: virtualClass.value,
          });
          if (data.success) {
            toast.success(data.message);
          } else {
            toast.error(
              "Le lien vers la classe virtuelle n'a pas été mis à jour",
            );
          }
        } catch {
          toast.error(
            "Le lien vers la classe virtuelle n'a pas été mis à jour",
          );
        }
        dispatch(
          { type: "SET_VIRTUAL_CLASS", payload: virtualClass.value },
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
    updateParcours,
  ]);

  return (
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
            <TagsWithDrawer
              loading={loadingTags}
              onSubmit={handleUpdateTags}
              tags={parentTags}
            />
          </Wrapper>
        </div>
      </div>
  );
};

export default ParcoursInformations;

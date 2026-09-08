import { FC, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import ParcoursInformationsForm from "./parcours-informations-form";
import VirtualClass from "../../../../../../src/components/virtual-class";
import BoxWrapper from "../../../../../../src/components/wrappers/BoxWrapper";
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
import { AuthContext } from "../../../../../store/AuthProvider";
import { isTeacherUser } from "../../../../../utils/helpers/user-role";
import AssignContactsToModulesModal from "./assign-contacts-to-modules-modal";
import { useAssignModuleContacts } from "../../../hooks/useAssignModuleContacts";

type Props = {
  parcoursId: string;
};

const ParcoursInformations: FC<Props> = ({ parcoursId }) => {
  const { user } = useContext(AuthContext);
  const readOnly = isTeacherUser(user);
  const numericParcoursId = Number(parcoursId);
  const { data: parcours } = useParcoursQuery(numericParcoursId);
  const { mutateAsync: updateParcours } = useUpdateParcours(numericParcoursId);
  const [submitVirtualClass, setSubmitVirtualClass] = useState<boolean>(false);
  const [contactsToAssign, setContactsToAssign] = useState<Contact[]>([]);

  const parcoursStartDate = parcours?.startDate ?? "";
  const parcoursEndDate = parcours?.endDate ?? "";
  const {
    loadingContacts,
    loadingTags,
    updateParcoursContacts,
    updateParcoursTags,
  } = useInfosService(numericParcoursId);
  const assignContactsMutation = useAssignModuleContacts(numericParcoursId);
  const { value: virtualClass } = useInput(
    (value) => regexUrl.test(value),
    parcours?.virtualClass ?? "",
  );
  const parentTags = (parcours?.formation.tags ?? []).map((item) =>
    "tag" in item ? (item.tag as Tag) : item,
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
    async (updatedContacts: Contact[]) => {
      const currentContactIds = new Set(
        (parcours?.contacts ?? []).flatMap(({ id }) =>
          typeof id === "number" ? [id] : [],
        ),
      );
      const addedContacts = updatedContacts.filter(
        ({ id }) => typeof id === "number" && !currentContactIds.has(id),
      );
      const success = await updateParcoursContacts(
        updatedContacts.flatMap((contact) =>
          contact.id === undefined ? [] : [contact.id],
        ),
      );
      if (success && addedContacts.length > 0 && parcours?.modules.length) {
        setContactsToAssign(addedContacts);
      }
    },
    [parcours?.contacts, parcours?.modules, updateParcoursContacts],
  );

  const handleAssignContactsToModules = async (moduleIds: number[]) => {
    const contactIds = contactsToAssign.flatMap(({ id }) =>
      typeof id === "number" ? [id] : [],
    );
    try {
      await assignContactsMutation.mutateAsync({ moduleIds, contactIds });
      return true;
    } catch {
      return false;
    }
  };

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
      updateDates(dates.startDate, dates.endDate);
    },
    [updateDates],
  );

  const handleVirtualClassValue = (
    event: React.FormEvent<HTMLInputElement>,
  ) => {
    if (readOnly) return;
    if (!submitVirtualClass) {
      setSubmitVirtualClass(true);
    }
    virtualClass.valueChangeHandler(event);
  };

  // met à jour la classe virtuelle vers la bdd
  useEffect(() => {
    if (readOnly) return;
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
        setSubmitVirtualClass(false);
      }
    }, autoSubmitTimer);

    return () => clearTimeout(timer);
  }, [
    parcoursId,
    virtualClass.value,
    virtualClass.isValid,
    submitVirtualClass,
    updateParcours,
    readOnly,
  ]);

  return (
    <div className="flex flex-col gap-y-4">
      <div
        className="w-full grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8"
        data-onboarding="parcours-information"
      >
        <BoxWrapper>
          <div className="flex flex-col gap-y-8">
            <ParcoursInformationsForm
              parcoursId={parcoursId}
              readOnly={readOnly}
            />
            <DatesSelecter
              startDateProp={parcoursStartDate}
              endDateProp={parcoursEndDate}
              label="Dates de parcours"
              onSubmitDates={submitDates}
              disabled={readOnly}
            />
            <VirtualClass
              onChangeValue={handleVirtualClassValue}
              virtualClass={virtualClass}
              disabled={readOnly}
            />
          </div>
        </BoxWrapper>
        <div className="flex flex-col gap-y-8">
          <BoxWrapper>
            <ContactsWithDrawer
              loading={loadingContacts}
              onSubmit={handleUpdateContacts}
              readOnly={readOnly}
            />
          </BoxWrapper>
          <BoxWrapper>
            <TagsWithDrawer
              loading={loadingTags}
              onSubmit={handleUpdateTags}
              tags={parentTags}
            />
          </BoxWrapper>
        </div>
      </div>
      {contactsToAssign.length > 0 && parcours?.modules.length ? (
        <AssignContactsToModulesModal
          contacts={contactsToAssign}
          modules={parcours.modules.flatMap((module) =>
            typeof module.id === "number"
              ? [{ id: module.id, title: module.title }]
              : [],
          )}
          isSubmitting={assignContactsMutation.isPending}
          onClose={() => setContactsToAssign([])}
          onSubmit={handleAssignContactsToModules}
        />
      ) : null}
    </div>
  );
};

export default ParcoursInformations;

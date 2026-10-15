import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router";

import Modal from "../../../../../components/UI/modal/modal";
import { getContactFullName } from "../../../../../utils/helpers/contact-full-name";
import type Contact from "../../../../../utils/interfaces/contact";
import type { ModuleData } from "../../../interfaces/new-module";
import { useRoleLabels } from "../../../../role/hooks/useRoleLabels";

type Props = {
  module: ModuleData;
  parcoursContacts: Contact[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (contactIds: number[]) => Promise<void>;
};

export default function AssignModuleContactsModal({
  module,
  parcoursContacts,
  isSubmitting,
  onClose,
  onSubmit,
}: Props) {
  const { teamLabel } = useRoleLabels();
  const [selectedContactIds, setSelectedContactIds] = useState<number[]>([]);
  const assignedContactIds = useMemo(
    () => new Set(module.contacts.flatMap(({ id }) => (id ? [id] : []))),
    [module.contacts],
  );
  const availableContacts = useMemo(
    () =>
      parcoursContacts.filter(
        (contact): contact is Contact & { id: number } =>
          typeof contact.id === "number" && !assignedContactIds.has(contact.id),
      ),
    [assignedContactIds, parcoursContacts],
  );

  const toggleContact = (contactId: number) => {
    setSelectedContactIds((current) =>
      current.includes(contactId)
        ? current.filter((id) => id !== contactId)
        : [...current, contactId],
    );
  };

  return (
    <Modal
      title={`Affecter des ressources à « ${module.title} »`}
      leftLabel="Annuler"
      rightLabel="Affecter"
      onLeftClick={onClose}
      onRightClick={() => void onSubmit(selectedContactIds)}
      rightDisabled={selectedContactIds.length === 0}
      isSubmitting={isSubmitting}
      modalBoxStyle="w-11/12 max-w-xl"
      dialogAdditionalClass="z-40"
    >
      <div className="mt-6">
        {availableContacts.length === 0 ? (
          // Aucune ressource à affecter : elles se gèrent à l'étape Informations du parcours.
          <div className="flex justify-center rounded-box bg-base-200 p-5">
            <Link to="?step=1" className="btn btn-primary btn-outline">
              <Plus className="size-4" aria-hidden="true" />
              Ajouter un membre « {teamLabel} »
            </Link>
          </div>
        ) : (
          <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {availableContacts.map((contact) => (
              <label
                key={contact.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg bg-base-200/60 px-3 py-3"
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm"
                  checked={selectedContactIds.includes(contact.id)}
                  onChange={() => toggleContact(contact.id)}
                />
                <span className="capitalize text-sm">
                  {getContactFullName(contact)}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

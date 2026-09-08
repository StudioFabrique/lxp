import { useMemo, useState } from "react";

import Modal from "../../../../../components/UI/modal/modal";
import { getContactFullName } from "../../../../../utils/helpers/contact-full-name";
import type Contact from "../../../../../utils/interfaces/contact";

type ModuleChoice = {
  id: number;
  title: string;
  contacts: Contact[];
};

type Props = {
  contacts: Contact[];
  modules: ModuleChoice[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (moduleIds: number[]) => Promise<boolean>;
};

export default function AssignContactsToModulesModal({
  contacts,
  modules,
  isSubmitting,
  onClose,
  onSubmit,
}: Props) {
  const assignableModules = useMemo(
    () =>
      modules.filter((module) =>
        contacts.some(
          ({ id: contactId }) =>
            typeof contactId === "number" &&
            !module.contacts.some(({ id }) => id === contactId),
        ),
      ),
    [contacts, modules],
  );
  const [selectedModuleIds, setSelectedModuleIds] = useState<number[]>(() =>
    assignableModules.map(({ id }) => id),
  );

  const resourceNames = contacts.map(getContactFullName).join(", ");
  const allModulesSelected =
    assignableModules.length > 0 &&
    assignableModules.every(({ id }) => selectedModuleIds.includes(id));

  const toggleModule = (moduleId: number) => {
    setSelectedModuleIds((current) =>
      current.includes(moduleId)
        ? current.filter((id) => id !== moduleId)
        : [...current, moduleId],
    );
  };

  return (
    <Modal
      title="Affecter aux modules existants"
      leftLabel="Plus tard"
      rightLabel="Affecter"
      onLeftClick={onClose}
      onRightClick={() => {
        void onSubmit(selectedModuleIds).then((success) => {
          if (success) onClose();
        });
      }}
      rightDisabled={selectedModuleIds.length === 0}
      isSubmitting={isSubmitting}
      modalBoxStyle="w-11/12 max-w-xl"
      dialogAdditionalClass="z-30"
    >
      <div className="mt-6 flex flex-col gap-4">
        <p className="text-sm text-base-content/70">
          Souhaitez-vous aussi affecter{" "}
          <span className="capitalize">{resourceNames}</span> aux modules
          suivants ?
        </p>
        {assignableModules.length === 0 ? (
          <p className="rounded-box bg-base-200 p-5 text-sm text-base-content/65">
            Cette ressource pédagogique est déjà affectée à tous les modules.
          </p>
        ) : (
          <>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg bg-base-200/60 px-3 py-3 font-medium">
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
                checked={allModulesSelected}
                onChange={(event) =>
                  setSelectedModuleIds(
                    event.currentTarget.checked
                      ? assignableModules.map(({ id }) => id)
                      : [],
                  )
                }
              />
              <span className="text-sm">
                {allModulesSelected
                  ? "Tout désélectionner"
                  : "Tout sélectionner"}
              </span>
            </label>
            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {assignableModules.map((module) => (
                <label
                  key={module.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg bg-base-200/60 px-3 py-3"
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm"
                    checked={selectedModuleIds.includes(module.id)}
                    onChange={() => toggleModule(module.id)}
                  />
                  <span className="text-sm">{module.title}</span>
                </label>
              ))}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

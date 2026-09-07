import { useState } from "react";
import { Pencil, Trash2, UserPlus, UserRound } from "lucide-react";

import EmptyStatePlaceholder from "../../../../../components/UI/empty-state-placeholder";
import HierarchicalListCard from "../../../../../components/UI/hierarchical-list-card/HierarchicalListCard";
import PermissionGuard from "../../../../../components/guards/PermissionGuard";
import { getContactFullName } from "../../../../../utils/helpers/contact-full-name";
import type Contact from "../../../../../utils/interfaces/contact";
import type { ModuleData } from "../../../interfaces/new-module";
import AssignModuleContactsModal from "./AssignModuleContactsModal";

type ModuleGridProps = {
  modules: ModuleData[];
  parcoursContacts: Contact[];
  isAssigningContacts: boolean;
  emptyMessage: string;
  onUpdate: (module: ModuleData) => void;
  onDelete: (id: number) => void;
  onAssignContacts: (
    moduleId: number,
    contactIds: number[],
  ) => Promise<boolean>;
};

export default function ModuleGrid({
  modules,
  parcoursContacts,
  isAssigningContacts,
  emptyMessage,
  onUpdate,
  onDelete,
  onAssignContacts,
}: ModuleGridProps) {
  const [moduleForContacts, setModuleForContacts] = useState<ModuleData | null>(
    null,
  );

  if (modules.length === 0) {
    return <EmptyStatePlaceholder title={emptyMessage} />;
  }

  return (
    <>
      <section className="grid items-start gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <HierarchicalListCard
            key={module.id}
            label="Module"
            title={module.title}
            truncateTitle
            description={
              module.duration ? `${module.duration} heure(s)` : undefined
            }
            action={
              <div className="flex items-center gap-1">
                <PermissionGuard action="update" object="module">
                  <button
                    type="button"
                    className="btn btn-square btn-sm btn-ghost tooltip tooltip-left"
                    data-tip="Affecter des ressources pédagogiques"
                    aria-label={`Affecter des ressources pédagogiques au module ${module.title}`}
                    onClick={() => setModuleForContacts(module)}
                  >
                    <UserPlus className="size-[1.2em]" />
                  </button>
                </PermissionGuard>
                <PermissionGuard action="update" object="module">
                  <button
                    type="button"
                    className="btn btn-square btn-sm btn-ghost tooltip tooltip-left"
                    data-tip="Modifier le module"
                    aria-label={`Modifier le module ${module.title}`}
                    onClick={() => onUpdate(module)}
                  >
                    <Pencil className="size-[1.2em]" />
                  </button>
                </PermissionGuard>
                <PermissionGuard action="delete" object="module">
                  <button
                    type="button"
                    className="btn btn-square btn-sm btn-ghost text-error tooltip tooltip-left"
                    data-tip="Supprimer le module"
                    aria-label={`Supprimer le module ${module.title}`}
                    onClick={() => onDelete(module.id)}
                  >
                    <Trash2 className="size-[1.2em]" />
                  </button>
                </PermissionGuard>
              </div>
            }
            items={module.contacts.map((contact) => ({
              id: contact.id ?? contact.idMdb,
              title: getContactFullName(contact),
              icon: <UserRound strokeWidth="1.5" />,
            }))}
            maxItemsShown={3}
            emptyMessage="Aucune ressource pédagogique affectée"
            moreItemsLabel={(count) => `Afficher plus de ressources (${count})`}
            overflowTitle={`Autres ressources de ${module.title}`}
          />
        ))}
      </section>

      {moduleForContacts ? (
        <AssignModuleContactsModal
          module={moduleForContacts}
          parcoursContacts={parcoursContacts}
          isSubmitting={isAssigningContacts}
          onClose={() => setModuleForContacts(null)}
          onSubmit={async (contactIds) => {
            const success = await onAssignContacts(
              moduleForContacts.id,
              contactIds,
            );
            if (success) setModuleForContacts(null);
          }}
        />
      ) : null}
    </>
  );
}

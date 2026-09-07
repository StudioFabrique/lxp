import { useState } from "react";
import {
  Pencil,
  SquareArrowRightEnter,
  Trash2,
  UserPlus,
  UserRound,
} from "lucide-react";
import { Link } from "react-router";

import EmptyStatePlaceholder from "../../../../../components/UI/empty-state-placeholder";
import HierarchicalListCard from "../../../../../components/UI/hierarchical-list-card/HierarchicalListCard";
import { HierarchicalListItemActions } from "../../../../../components/UI/hierarchical-list-card/HierarchicalListRow";
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
  const [moduleForContacts, setModuleForContacts] =
    useState<ModuleData | null>(null);

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
                <PermissionGuard action="read" object="module">
                  <Link
                    className="btn btn-square btn-sm btn-ghost tooltip tooltip-left"
                    data-tip="Accéder au module"
                    to={`/admin/parcours/module/${module.id}`}
                    aria-label={`Accéder au module ${module.title}`}
                  >
                    <SquareArrowRightEnter className="size-[1.2em]" />
                  </Link>
                </PermissionGuard>
                <HierarchicalListItemActions
                  title={module.title}
                  actions={[
                    {
                      label: "Affecter des ressources pédagogiques",
                      icon: <UserPlus />,
                      onSelect: () => setModuleForContacts(module),
                      permission: { action: "update", object: "module" },
                    },
                    {
                      label: "Modifier le module",
                      icon: <Pencil />,
                      onSelect: () => onUpdate(module),
                      permission: { action: "update", object: "module" },
                    },
                    {
                      label: "Supprimer le module",
                      icon: <Trash2 />,
                      onSelect: () => onDelete(module.id),
                      destructive: true,
                      permission: { action: "delete", object: "module" },
                    },
                  ]}
                />
              </div>
            }
            items={module.contacts.map((contact) => ({
              id: contact.id ?? contact.idMdb,
              title: getContactFullName(contact),
              icon: <UserRound strokeWidth="1.5" />,
            }))}
            maxItemsShown={3}
            emptyMessage="Aucune ressource pédagogique affectée"
            moreItemsLabel={(count) =>
              `Afficher plus de ressources (${count})`
            }
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

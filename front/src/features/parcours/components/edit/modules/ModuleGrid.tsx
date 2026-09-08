import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import EmptyStatePlaceholder from "../../../../../components/UI/empty-state-placeholder";
import PermissionGuard from "../../../../../components/guards/PermissionGuard";
import type Contact from "../../../../../utils/interfaces/contact";
import type Skill from "../../../../../utils/interfaces/skill";
import type { ModuleData } from "../../../interfaces/new-module";
import AssignModuleContactsModal from "./AssignModuleContactsModal";
import AssignModuleSkillsModal from "./AssignModuleSkillsModal";
import ModuleCard from "./ModuleCard";

type ModuleGridProps = {
  modules: ModuleData[];
  parcoursContacts: Contact[];
  parcoursSkills: Skill[];
  isAssigningContacts: boolean;
  isAssigningSkills: boolean;
  removingContact: { moduleId: number; contactId: number } | null;
  removingSkill: { moduleId: number; skillId: number } | null;
  lockedContactId?: number;
  highlightedModuleId?: number | null;
  emptyMessage: string;
  onUpdate: (module: ModuleData) => void;
  onDelete: (id: number) => void;
  onAssignContacts: (
    moduleId: number,
    contactIds: number[],
  ) => Promise<boolean>;
  onAssignSkills: (moduleId: number, skillIds: number[]) => Promise<boolean>;
  onRemoveContact: (moduleId: number, contactId: number) => Promise<boolean>;
  onRemoveSkill: (moduleId: number, skillId: number) => Promise<boolean>;
};

export default function ModuleGrid({
  modules,
  parcoursContacts,
  parcoursSkills,
  isAssigningContacts,
  isAssigningSkills,
  removingContact,
  removingSkill,
  lockedContactId,
  highlightedModuleId,
  emptyMessage,
  onUpdate,
  onDelete,
  onAssignContacts,
  onAssignSkills,
  onRemoveContact,
  onRemoveSkill,
}: ModuleGridProps) {
  const [moduleForContacts, setModuleForContacts] = useState<ModuleData | null>(
    null,
  );
  const [moduleForSkills, setModuleForSkills] = useState<ModuleData | null>(
    null,
  );

  useEffect(() => {
    if (highlightedModuleId == null) return;

    document
      .getElementById(`parcours-module-${highlightedModuleId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlightedModuleId, modules]);

  if (modules.length === 0) {
    return <EmptyStatePlaceholder title={emptyMessage} />;
  }

  return (
    <>
      <section className="grid items-start gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            highlighted={highlightedModuleId === module.id}
            headerAction={
              <div className="flex items-center gap-1">
                <PermissionGuard action="update" object="module">
                  <button
                    type="button"
                    className="btn btn-square btn-sm border-white/60 bg-base-100/90 text-base-content shadow-sm tooltip tooltip-bottom tooltip-end hover:bg-base-100"
                    data-tip="Modifier les informations du module"
                    aria-label={`Modifier le module ${module.title}`}
                    onClick={() => onUpdate(module)}
                  >
                    <Pencil className="size-[1.2em]" />
                  </button>
                </PermissionGuard>
                <PermissionGuard action="delete" object="module">
                  <button
                    type="button"
                    className="btn btn-square btn-sm border-white/60 bg-base-100/90 text-error shadow-sm tooltip tooltip-left hover:bg-base-100"
                    data-tip="Supprimer le module"
                    aria-label={`Supprimer le module ${module.title}`}
                    onClick={() => onDelete(module.id)}
                  >
                    <Trash2 className="size-[1.2em]" />
                  </button>
                </PermissionGuard>
              </div>
            }
            onAssignContacts={setModuleForContacts}
            onAssignSkills={setModuleForSkills}
            removingContactId={
              removingContact?.moduleId === module.id
                ? removingContact.contactId
                : null
            }
            removingSkillId={
              removingSkill?.moduleId === module.id
                ? removingSkill.skillId
                : null
            }
            isRemovingContact={removingContact !== null}
            isRemovingSkill={removingSkill !== null}
            lockedContactId={lockedContactId}
            onRemoveContact={(contactId) =>
              void onRemoveContact(module.id, contactId)
            }
            onRemoveSkill={(skillId) => void onRemoveSkill(module.id, skillId)}
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

      {moduleForSkills ? (
        <AssignModuleSkillsModal
          module={moduleForSkills}
          parcoursSkills={parcoursSkills}
          isSubmitting={isAssigningSkills}
          onClose={() => setModuleForSkills(null)}
          onSubmit={async (skillIds) => {
            const success = await onAssignSkills(moduleForSkills.id, skillIds);
            if (success) setModuleForSkills(null);
          }}
        />
      ) : null}
    </>
  );
}

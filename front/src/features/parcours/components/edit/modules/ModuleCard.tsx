import type { ReactNode } from "react";
import { LoaderCircle, Plus, Trash2, UserPlus, UserRound } from "lucide-react";

import defaultModuleImage from "../../../../../assets/images/module-default-thumb.png";
import HierarchicalListCard from "../../../../../components/UI/hierarchical-list-card/HierarchicalListCard";
import TrophyIcon from "../../../../../components/UI/svg/trophy-icon.component";
import PermissionGuard from "../../../../../components/guards/PermissionGuard";
import { cn } from "../../../../../utils/cn";
import { getContactFullName } from "../../../../../utils/helpers/contact-full-name";
import { normalizeImageSource } from "../../../../../utils/images/image-source";
import { hasCompleteModuleRequirements } from "../../../helpers/parcours-steps-validation";
import type { ModuleData } from "../../../interfaces/new-module";

type ModuleCardProps = {
  module: ModuleData;
  highlighted?: boolean;
  headerAction?: ReactNode;
  onAssignContacts?: (module: ModuleData) => void;
  onAssignSkills?: (module: ModuleData) => void;
  isRemovingContact?: boolean;
  isRemovingSkill?: boolean;
  removingContactId?: number | null;
  removingSkillId?: number | null;
  lockedContactId?: number;
  onRemoveContact?: (contactId: number) => void;
  onRemoveSkill?: (skillId: number) => void;
};

export default function ModuleCard({
  module,
  highlighted = false,
  headerAction,
  onAssignContacts,
  onAssignSkills,
  isRemovingContact = false,
  isRemovingSkill = false,
  removingContactId,
  removingSkillId,
  lockedContactId,
  onRemoveContact,
  onRemoveSkill,
}: ModuleCardProps) {
  const isIncomplete = !hasCompleteModuleRequirements({
    duration: module.duration,
    contacts: module.contacts,
    skills: module.skills,
  });

  return (
    <article
      id={`parcours-module-${module.id}`}
      data-highlighted={highlighted || undefined}
      className={cn(
        "scroll-m-6 rounded-box transition-shadow duration-500",
        highlighted &&
          "ring-2 ring-primary ring-offset-2 ring-offset-base-100 shadow-xl animate-pulse animation-keyframes:keyframes-pulse_{0%,100%{opacity:1}50%{opacity:0.8}}]",
      )}
    >
      <HierarchicalListCard
        label="Module"
        labelAccessory={
          isIncomplete ? (
            <span className="badge badge-warning badge-xs">Incomplet</span>
          ) : undefined
        }
        title={module.title}
        truncateTitle
        headerBackgroundImage={
          normalizeImageSource(module.thumb) ?? defaultModuleImage
        }
        headerClassName="min-h-24"
        description={
          module.duration ? `${module.duration} heure(s)` : undefined
        }
        action={headerAction}
        items={module.contacts.map((contact) => {
          const contactName = getContactFullName(contact);

          return {
            id: contact.id ?? contact.idMdb,
            title: contactName,
            icon: <UserRound strokeWidth="1.5" />,
            action:
              onRemoveContact && typeof contact.id === "number"
                ? (dismissOverflow) => (
                    <PermissionGuard action="update" object="module">
                      <button
                        type="button"
                        className="btn btn-square btn-sm btn-ghost text-error tooltip tooltip-left"
                        data-tip={
                          contact.id === lockedContactId
                            ? "Cette affectation est requise"
                            : "Retirer la ressource pédagogique"
                        }
                        aria-label={`Retirer la ressource pédagogique ${contactName} du module ${module.title}`}
                        disabled={
                          isRemovingContact || contact.id === lockedContactId
                        }
                        onClick={() => {
                          dismissOverflow();
                          onRemoveContact(contact.id!);
                        }}
                      >
                        {removingContactId === contact.id ? (
                          <LoaderCircle className="size-[1.2em] animate-spin" />
                        ) : (
                          <Trash2 className="size-[1.2em]" />
                        )}
                      </button>
                    </PermissionGuard>
                  )
                : undefined,
          };
        })}
        maxItemsShown={3}
        emptyMessage="Aucune ressource pédagogique affectée"
        moreItemsLabel={(count) => `Afficher plus de ressources (${count})`}
        overflowTitle={`Autres ressources de ${module.title}`}
        footerAtBottom
        footerClassName="py-2"
        hideLastItemDivider
        footer={
          <div className="flex w-full flex-col gap-3 px-4">
            {module.skills.length > 0 && (
              <div className="border-t border-base-300 pt-3">
                <p className="mb-2 text-xs font-semibold tracking-wide text-base-content/55">
                  Compétences
                </p>

                <div className="flex flex-wrap gap-2">
                  {module.skills.map((skill, index) => {
                    const canRemove =
                      onRemoveSkill && typeof skill.id === "number";

                    return (
                      <div
                        key={skill.id ?? `${skill.description}-${index}`}
                        className={cn("tooltip tooltip-top relative", {
                          "group/skill": canRemove,
                        })}
                        data-tip={skill.description}
                      >
                        <div className="flex size-10 items-center justify-center rounded-lg bg-secondary/10 p-1.5">
                          {skill.badge ? (
                            <img
                              src={skill.badge}
                              alt=""
                              className="size-full object-contain"
                            />
                          ) : (
                            <span
                              className="size-6 text-primary"
                              aria-hidden="true"
                            >
                              <TrophyIcon />
                            </span>
                          )}
                          <span className="sr-only">{skill.description}</span>
                        </div>
                        {canRemove ? (
                          <PermissionGuard action="update" object="module">
                            <button
                              type="button"
                              className={cn(
                                "absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-base-100/60 text-error opacity-0 backdrop-blur-sm transition-opacity group-hover/skill:opacity-100 focus-visible:opacity-100",
                                {
                                  "opacity-100": removingSkillId === skill.id,
                                },
                              )}
                              aria-label={`Retirer la compétence ${skill.description} du module ${module.title}`}
                              disabled={isRemovingSkill}
                              onClick={() => onRemoveSkill(skill.id!)}
                            >
                              {removingSkillId === skill.id ? (
                                <LoaderCircle className="size-5 animate-spin" />
                              ) : (
                                <Trash2 className="size-5" />
                              )}
                            </button>
                          </PermissionGuard>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {onAssignContacts ? (
              <div className="flex justify-end">
                <PermissionGuard action="update" object="module">
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost text-primary"
                    aria-label={`Affecter des ressources pédagogiques au module ${module.title}`}
                    disabled={isRemovingContact}
                    onClick={() => onAssignContacts(module)}
                  >
                    <UserPlus className="size-4" />
                    Affecter des ressources pédagogiques
                  </button>
                </PermissionGuard>
              </div>
            ) : null}

            {onAssignSkills ? (
              <div className="flex justify-end">
                <PermissionGuard action="update" object="module">
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost text-primary"
                    aria-label={`Ajouter des compétences au module ${module.title}`}
                    disabled={isRemovingSkill}
                    onClick={() => onAssignSkills(module)}
                  >
                    <Plus className="size-4" />
                    Ajouter des compétences
                  </button>
                </PermissionGuard>
              </div>
            ) : null}
          </div>
        }
      />
    </article>
  );
}

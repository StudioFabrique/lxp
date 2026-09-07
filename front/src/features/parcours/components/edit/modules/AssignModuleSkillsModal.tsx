import { useMemo, useState } from "react";

import Modal from "../../../../../components/UI/modal/modal";
import type Skill from "../../../../../utils/interfaces/skill";
import type { ModuleData } from "../../../interfaces/new-module";

type Props = {
  module: ModuleData;
  parcoursSkills: Skill[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (skillIds: number[]) => Promise<void>;
};

export default function AssignModuleSkillsModal({
  module,
  parcoursSkills,
  isSubmitting,
  onClose,
  onSubmit,
}: Props) {
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
  const assignedSkillIds = useMemo(
    () => new Set(module.skills.flatMap(({ id }) => (id ? [id] : []))),
    [module.skills],
  );
  const availableSkills = useMemo(
    () =>
      parcoursSkills.filter(
        (skill): skill is Skill & { id: number } =>
          typeof skill.id === "number" && !assignedSkillIds.has(skill.id),
      ),
    [assignedSkillIds, parcoursSkills],
  );

  const toggleSkill = (skillId: number) => {
    setSelectedSkillIds((current) =>
      current.includes(skillId)
        ? current.filter((id) => id !== skillId)
        : [...current, skillId],
    );
  };

  return (
    <Modal
      title={`Ajouter des compétences à « ${module.title} »`}
      leftLabel="Annuler"
      rightLabel="Ajouter"
      onLeftClick={onClose}
      onRightClick={() => void onSubmit(selectedSkillIds)}
      rightDisabled={selectedSkillIds.length === 0}
      isSubmitting={isSubmitting}
      modalBoxStyle="w-11/12 max-w-xl"
      dialogAdditionalClass="z-30"
    >
      <div className="mt-6">
        {availableSkills.length === 0 ? (
          <p className="rounded-box bg-base-200 p-5 text-sm text-base-content/65">
            Toutes les compétences du parcours sont déjà associées à ce module.
          </p>
        ) : (
          <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {availableSkills.map((skill) => (
              <label
                key={skill.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg bg-base-200/60 px-3 py-3"
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm"
                  checked={selectedSkillIds.includes(skill.id)}
                  onChange={() => toggleSkill(skill.id)}
                />
                <span className="text-sm first-letter:uppercase">
                  {skill.description}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

import { FC } from "react";
import Skill from "../../../../utils/interfaces/skill";
import DeleteButton from "../../modules-list/modules-item/buttons/delete-button.component";

const SkillItem: FC<{ skill: Skill; onDelete: (id: number) => void }> = ({
  skill,
  onDelete,
}) => {
  const handleDelete = () => {
    onDelete(skill.id!);
  };
  return (
    <div className="flex justify-between bg-secondary-content p-2 rounded-lg w-full items-center">
      <p className="">{skill.description}</p>
      <DeleteButton onDelete={handleDelete} color="red" />
    </div>
  );
};

export default SkillItem;

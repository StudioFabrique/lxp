import Skill from "../../../utils/interfaces/skill";
import { sortArray } from "../../../utils/sortArray";
import InheritedItems from "../../inherited-items/inherited-items";
import CurrentSkills from "./current-skills";
import NotSelectedSkills from "./not-selected-skills";

interface SkillsWithDrawerProps {
  loading: boolean;
  initialList: Skill[];
  currentItems: Skill[];
  property: string;
  isDisabled: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (items: any[]) => void;
}

const SkillsWithDrawer = (props: SkillsWithDrawerProps) => {
  return (
    <InheritedItems
      drawerId="add-skills"
      drawerTitle="Ajouter des Compétences"
      loading={props.loading}
      initialList={sortArray(props.initialList, "createdAt", false)}
      selectedItems={props.currentItems}
      isDisabled={props.isDisabled}
      property={props.property}
      onSubmit={props.onSubmit}
    >
      <CurrentSkills list={props.currentItems} />
      <NotSelectedSkills />
    </InheritedItems>
  );
};

export default SkillsWithDrawer;

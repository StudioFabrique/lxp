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
      tooltip="Associer un des objectifs du parcours à votre cours"
      buttonLabel="Sélectionner des compétences"
      drawerId="add-skills"
      drawerTitle="Sélectionner des compétences"
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

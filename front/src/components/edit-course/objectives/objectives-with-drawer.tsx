import Objective from "../../../utils/interfaces/objective";
import InheritedItems from "../../inherited-items/inherited-items";
import InheritedTextList from "../../inherited-items/inherited-text-list";
import NotSelectedObjectives from "../../inherited-items/not-selected-objtives";

interface ObjectivesWithDrawerProps {
  loading: boolean;
  initialList: Objective[];
  currentItems: Objective[];
  property: string;
  isDisabled: boolean;
  onSubmit: (items: any[]) => void;
}

const ObjectivesWithDrawer = (props: ObjectivesWithDrawerProps) => {
  return (
    <InheritedItems
      drawerId="add-objectives"
      drawerTitle="Ajouter des Objectifs"
      title="Objectifs"
      loading={props.loading}
      initialList={props.initialList}
      selectedItems={props.currentItems}
      isDisabled={props.isDisabled}
      property={props.property}
      onSubmit={props.onSubmit}
    >
      <InheritedTextList property="description" />
      <NotSelectedObjectives />
    </InheritedItems>
  );
};

export default ObjectivesWithDrawer;

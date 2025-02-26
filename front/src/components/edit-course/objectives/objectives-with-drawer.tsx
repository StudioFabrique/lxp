/* eslint-disable @typescript-eslint/no-explicit-any */
import Objective from "../../../utils/interfaces/objective";
import { sortArray } from "../../../utils/sortArray";
import InheritedItems from "../../inherited-items/inherited-items";
import InheritedTextList from "../../inherited-items/inherited-text-list";
import NotSelectedObjectives from "../../inherited-items/not-selected-objectives";

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
      tooltip="Associer un des objectifs du parcours à votre cours"
      buttonLabel="Sélectionner des objectifs"
      drawerId="add-objectives"
      drawerTitle="Sélectionner des objectifs"
      loading={props.loading}
      initialList={sortArray(props.initialList, "createdAt", false)}
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

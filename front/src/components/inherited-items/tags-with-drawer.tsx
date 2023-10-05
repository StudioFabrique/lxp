import Tag from "../../utils/interfaces/tag";
import CurrentTags from "./current-tags";
import InheritedItems from "./inherited-items";
import NotSelectedTags from "./not-selected-tags";

interface TagsWithDrawerProps {
  loading: boolean;
  initialList: Tag[];
  currentItems: Tag[];
  property: string;
  onSubmit: (items: any[]) => void;
}

const TagsWithDrawer = (props: TagsWithDrawerProps) => {
  return (
    <InheritedItems
      drawerId="add-tags"
      drawerTitle="Ajouter des Tags"
      title="Tags"
      loading={props.loading}
      initialList={props.initialList}
      currentItems={props.currentItems}
      property={props.property}
      onSubmit={props.onSubmit}
    >
      <CurrentTags />
      <NotSelectedTags />
    </InheritedItems>
  );
};

export default TagsWithDrawer;

import Tag from "../../../../../../src/utils/interfaces/tag";
import TagsWithDrawer from "../../../../parcours/components/edit/informations/tags-with-drawer";

type Props = {
  tags: Tag[];
  inheritedTags: Tag[];
  onSubmit: (tags: Tag[]) => void;
  loading: boolean;
};

function CourseTags(props: Props) {
  return (
    <TagsWithDrawer
      onSubmit={props.onSubmit}
      loading={props.loading}
      tags={props.inheritedTags}
      selectedTags={props.tags}
      inheritedTagsLabel="Tags du parcours"
    />
  );
}

export default CourseTags;

import Tag from "../../../utils/interfaces/tag";
import TagsWithDrawer from "../../edit-parcours/informations/tags-with-drawer";

type Props = {
  tags: Tag[];
  onSubmit: (tags: Tag[]) => void;
  loading: boolean;
};

function CourseTags(props: Props) {
  return (
    <TagsWithDrawer
      onSubmit={props.onSubmit}
      loading={props.loading}
      tags={props.tags}
    />
  );
}

export default CourseTags;

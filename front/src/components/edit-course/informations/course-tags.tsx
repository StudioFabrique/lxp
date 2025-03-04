import Tag from "../../../utils/interfaces/tag";
import TagsWithDrawer from "../../edit-parcours/informations/tags-with-drawer";

type Props = {
  onSubmit: (tags: Tag[]) => void;
  loading: boolean;
};

function CourseTags(props: Props) {
  return <TagsWithDrawer onSubmit={props.onSubmit} loading={props.loading} />;
}

export default CourseTags;

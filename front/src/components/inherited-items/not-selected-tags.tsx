import Tag from "../../utils/interfaces/tag";
import TagItem from "../UI/tag-item/tag-item";

interface NotSelectedTagsProps {
  list: Tag[];
  onAddTag: (tagId: number) => void;
  onCloseDrawer: (id: string) => void;
}

const NotSelectedTags = (props: NotSelectedTagsProps) => {
  return (
    <>
      {props.list && props.list.length > 0 ? (
        <ul>
          {props.list.map((tag) => (
            <li key={tag.id} onClick={() => props.onAddTag(tag.id)}>
              <TagItem tag={tag} />
            </li>
          ))}
        </ul>
      ) : (
        <>
          <p>Tous les tags ont été sélectionnés</p>
          <div className="divider" />
          <div className="w-full flex justify-center">
            <button
              className="btn btn-primary"
              onClick={() => props.onCloseDrawer("add-tags")}
            >
              Fermer
            </button>
          </div>
        </>
      )}
    </>
  );
};
export default NotSelectedTags;

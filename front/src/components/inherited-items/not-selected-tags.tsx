import Tag from "../../utils/interfaces/tag";
import TagItem from "../UI/tag-item/tag-item";

interface NotSelectedTagsProps {
  list?: Tag[];
  onAddItem?: (items: number[]) => void;
  onCloseDrawer?: (id: string) => void;
}

const NotSelectedTags = (props: NotSelectedTagsProps) => {
  const handleAddTag = (id: number) => {
    const ids = [id];
    props.onAddItem!(ids);
  };

  return (
    <>
      {props.list && props.list.length > 0 ? (
        <ul className="w-[30rem] flex flex-wrap gap-2">
          {props.list.map((tag) => (
            <div key={tag.id} onClick={() => handleAddTag(tag.id)}>
              <TagItem tag={tag} noIcon={true} />
            </div>
          ))}
        </ul>
      ) : (
        <>
          <p>Tous les tags ont été sélectionnés</p>
        </>
      )}
    </>
  );
};
export default NotSelectedTags;

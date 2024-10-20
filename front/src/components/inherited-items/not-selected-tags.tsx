import { ReactNode } from "react";
import Tag from "../../utils/interfaces/tag";
import { sortArray } from "../../utils/sortArray";
import TagItem from "../UI/tag-item/tag-item";

interface NotSelectedTagsProps {
  list?: Tag[];
  onAddItems?: (items: number[]) => void;
  onCloseDrawer?: (id: string) => void;
  children?: ReactNode;
}

const NotSelectedTags = (props: NotSelectedTagsProps) => {
  const handleAddTag = (id: number) => {
    const ids = [id];
    props.onAddItems!(ids);
  };
  console.log("liste", props.list);
  return (
    <>
      {props.list && props.list.length > 0 ? (
        <ul className="w-[30rem] flex flex-wrap gap-2">
          {sortArray(props.list, "name").map((tag) => (
            <div key={tag.id} onClick={() => handleAddTag(tag.id)}>
              <TagItem tag={tag} noIcon={true} />
            </div>
          ))}
        </ul>
      ) : (
        <>
          {props.children ? (
            props.children
          ) : (
            <p>Tous les tags ont été sélectionnés</p>
          )}
        </>
      )}
    </>
  );
};
export default NotSelectedTags;

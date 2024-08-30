import { Dispatch, ReactNode, SetStateAction } from "react";
import Tag from "../../../utils/interfaces/tag";
import { sortArray } from "../../../utils/sortArray";
import TagItem from "../../UI/tag-item/tag-item";

interface Props {
  list?: Tag[];
  formationId: number;
  formations: any;
  onAddItems?: (items: number[]) => void;
  onCloseDrawer?: (id: string) => void;
  children?: ReactNode;
  onSearchTag: Dispatch<SetStateAction<string>>;
}

const ParcoursTagsSelecter = (props: Props) => {
  const handleAddTag = (id: number) => {
    const ids = [id];
    props.onAddItems!(ids);
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-between place-items-center">
        <select className="select select-sm select-primary" />
        <input className="input input-sm input-primary" />
      </div>
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
    </div>
  );
};
export default ParcoursTagsSelecter;

/* eslint-disable @typescript-eslint/no-explicit-any */
import Tag from "../../../utils/interfaces/tag";
import { sortArray } from "../../../utils/helpers/sort-array";
import TagItem from "../../UI/tag-item/tag-item";
import SubBoxWrapper from "../../wrappers/SubBoxWrapper";

interface CurrentTagsProps {
  list?: Tag[];
  onRemoveItem?: (value: any) => void;
}

const CurrentTags = (props: CurrentTagsProps) => {
  return (
    <>
      {props.list && props.list.length > 0 ? (
        <ul className="flex gap-2 flex-wrap">
          {sortArray(props.list, "name").map((item) => (
            <li key={item.id} onClick={() => props.onRemoveItem!(item)}>
              <TagItem tag={item} />
            </li>
          ))}
        </ul>
      ) : (
        <SubBoxWrapper>
          <p className="text-xs mb-2">Aucun tag sélectionné</p>
        </SubBoxWrapper>
      )}
    </>
  );
};

export default CurrentTags;

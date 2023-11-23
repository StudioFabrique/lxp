/* eslint-disable @typescript-eslint/no-explicit-any */
import Tag from "../../utils/interfaces/tag";
import { sortArray } from "../../utils/sortArray";
import SubWrapper from "../UI/sub-wrapper/sub-wrapper.component";
import TagItem from "../UI/tag-item/tag-item";

interface CurrentTagsProps {
  list?: Tag[];
  onRemoveItem?: (value: any) => void;
}

const CurrentTags = (props: CurrentTagsProps) => {
  return (
    <>
      {props.list && props.list.length > 0 ? (
        <ul className="flex gap-2 flex-wrap">
          {sortArray(props.list, "name").map((item: any) => (
            <li key={item.id} onClick={() => props.onRemoveItem!(item)}>
              <TagItem tag={item} />
            </li>
          ))}
        </ul>
      ) : (
        <SubWrapper>
          <p className="text-xs">Aucun tag sélectionné</p>
        </SubWrapper>
      )}
    </>
  );
};

export default CurrentTags;

/* eslint-disable @typescript-eslint/no-explicit-any */
import Tag from "../../../utils/interfaces/tag";
import { sortArray } from "../../../utils/helpers/sort-array";
import TagItem from "../../UI/tag-item/tag-item";
import SubBoxWrapper from "../../wrappers/SubBoxWrapper";

interface CurrentTagsProps {
  list?: Tag[];
  onRemoveItem?: (value: any) => void;
  isDisabled?: boolean;
  lockedItemIds?: number[];
}

const CurrentTags = (props: CurrentTagsProps) => {
  return (
    <>
      {props.list && props.list.length > 0 ? (
        <ul className="flex gap-2 flex-wrap">
          {sortArray(props.list, "name").map((item) => {
            const isLocked =
              props.isDisabled || props.lockedItemIds?.includes(item.id);
            return (
              <li
                key={item.id}
                onClick={() => !isLocked && props.onRemoveItem?.(item)}
                title={
                  isLocked
                    ? "Ce tag a été ajouté par un administrateur ou une autre équipe pédagogique"
                    : undefined
                }
              >
                <TagItem tag={item} noIcon={isLocked} disabled={isLocked} />
              </li>
            );
          })}
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

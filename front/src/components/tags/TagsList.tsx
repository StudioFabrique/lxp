import type Tag from "../../utils/interfaces/tag";
import TagItem from "../../../src.legacy/components/UI/tag-item/tag-item";

type Props = {
  tagsList: Tag[];
  onRemove?: (id: number) => void;
};

const TagsList = ({ tagsList, onRemove }: Props) => (
  <ul className="flex flex-wrap gap-2">
    {tagsList.map((item) => (
      <li
        key={item.id}
        onClick={onRemove ? () => onRemove(item.id) : undefined}
      >
        <TagItem tag={item} />
      </li>
    ))}
  </ul>
);

export default TagsList;

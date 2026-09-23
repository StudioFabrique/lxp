import type Tag from "../../utils/interfaces/tag";
import TagItem from "../UI/tag-item/tag-item";

type Props = {
  tagsList: Tag[];
  onRemove?: (id: number) => void;
};

const TagsList = ({ tagsList, onRemove }: Props) => (
  <ul className="flex flex-wrap gap-2">
    {tagsList.map((item) => (
      <li key={item.id}>
        <TagItem tag={item} onClick={onRemove ? () => onRemove(item.id) : undefined} />
      </li>
    ))}
  </ul>
);

export default TagsList;

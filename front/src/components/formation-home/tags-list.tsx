import Tag from "../../utils/interfaces/tag";
import TagItem from "../UI/tag-item/tag-item";

interface TagsListProps {
  tagsList: Tag[];
  onRemove?: (id: number) => void;
}

export default function TagsList(props: TagsListProps) {
  return (
    <ul className="flex flex-wrap gap-2">
      {props.tagsList.map((item) => (
        <li
          key={item.id}
          onClick={
            props.onRemove !== undefined
              ? () => props.onRemove!(item.id)
              : () => {}
          }
        >
          <TagItem tag={item} />
        </li>
      ))}
    </ul>
  );
}

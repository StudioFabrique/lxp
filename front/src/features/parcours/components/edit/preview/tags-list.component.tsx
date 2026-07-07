import Tag from "../../../../../../src.legacy/utils/interfaces/tag";
import TagItem from "../../../../../../src.legacy/components/UI/tag-item/tag-item";

interface TagsListProps {
  tagsList: Tag[];
}

const TagsList = (props: TagsListProps) => {
  return (
    <article className="flex flex-wrap gap-2">
      {props.tagsList.map((tag) => (
        <span key={tag.id}>
          <TagItem tag={tag} />
        </span>
      ))}
    </article>
  );
};

export default TagsList;

import TagItem from "../../../../components/UI/tag-item/tag-item";
import { useParams } from "react-router";
import { useParcoursQuery } from "../../hooks/useParcoursQuery";
import type Tag from "../../../../utils/interfaces/tag";
import CollapsibleSection from "./collapsible-section";

const Tags = () => {
  const { id } = useParams();
  const { data: parcours } = useParcoursQuery(id ? Number(id) : undefined);
  const tags = (parcours?.tags ?? []).map((item) =>
    "tag" in item ? (item.tag as Tag) : item,
  );

  if (tags.length === 0) return null;

  const previewTags = tags.slice(0, 3);
  const remainingTags = tags.length - previewTags.length;

  return (
    <CollapsibleSection
      title="Tags"
      preview={
        <span className="flex min-w-0 items-center gap-2 overflow-hidden">
          {previewTags.map((tag) => (
            <span
              key={tag.id}
              className="max-w-32 truncate rounded-md px-2 py-1 text-xs font-bold"
              style={{ backgroundColor: tag.color }}
            >
              #{tag.name}
            </span>
          ))}
          {remainingTags > 0 ? (
            <span className="shrink-0 text-xs opacity-60">
              +{remainingTags}
            </span>
          ) : null}
        </span>
      }
    >
      <div className="flex gap-4 flex-wrap overflow-y-auto">
        {tags.map((tag) => (
          <TagItem key={tag.id} tag={tag} noIcon />
        ))}
      </div>
    </CollapsibleSection>
  );
};

export default Tags;

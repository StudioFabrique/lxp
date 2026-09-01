import Tag from "../../../../../../src/utils/interfaces/tag";
import CurrentTags from "../../../../../../src/components/shared/inherited-items/current-tags";
import InheritedItems from "../../../../../../src/components/shared/inherited-items/inherited-items";
import { useCallback, useMemo, useState } from "react";
import ParcoursTagsSelecter from "./parcours-tags-selecter";
import CreateNewTag from "./create-new-tags";
import { useParcoursTagsQuery } from "../../../hooks/useParcoursTagsQuery";
import { useParams } from "react-router";
import { useParcoursQuery } from "../../../hooks/useParcoursQuery";
import { Plus } from "lucide-react";

interface TagsWithDrawerProps {
  loading: boolean;
  onSubmit: (items: Tag[]) => void;
  tags: Tag[];
  selectedTags?: Tag[];
  inheritedTagsLabel?: string;
}

const TagsWithDrawer = (props: TagsWithDrawerProps) => {
  const { onSubmit } = props;
  const { data: availableTags } = useParcoursTagsQuery();
  const { id } = useParams();
  const { data: parcours } = useParcoursQuery(id ? Number(id) : undefined);
  const selectedParcoursTags = useMemo(() => {
    const tags = parcours?.tags as Array<Tag | { tag: Tag }> | undefined;
    return (tags ?? []).map((item) => ("tag" in item ? item.tag : item));
  }, [parcours?.tags]);
  const [draftTags, setDraftTags] = useState<Tag[] | null>(null);
  const currentTags =
    draftTags ?? props.selectedTags ?? selectedParcoursTags;

  const handleUpdateTags = useCallback(
    (tags: Tag[]) => {
      setDraftTags(tags);
      onSubmit(tags);
    },
    [onSubmit],
  );

  return (
    <div
      className="flex flex-col justify-between gap-y-4 h-full"
      data-onboarding-field="parcours-tags"
      data-onboarding-valid={currentTags.length > 0 ? "true" : "false"}
    >
      <span className="h-full flex-1">
        <InheritedItems
          drawerId="add-tags"
          drawerTitle="Ajouter des tags"
          title="Tags"
          loading={props.loading}
          initialList={availableTags ?? []}
          selectedItems={currentTags}
          property="name"
          onSubmit={handleUpdateTags}
        >
          <CurrentTags />
          <ParcoursTagsSelecter
            inheritedTags={props.tags}
            inheritedTagsLabel={
              props.inheritedTagsLabel ?? "Tags de la formation"
            }
          />
        </InheritedItems>
      </span>

      <div className="flex flex-col items-end">
        <button
          className="pl-2 text-xs text-primary btn btn-sm btn-ghost underline"
          onClick={() => document.getElementById("create-tags")?.click()}
          type="button"
        >
          <Plus className="w-4 h-4" />
          <span>Créer de nouveaux tags</span>
        </button>
        <CreateNewTag
          onCreated={(tags) => handleUpdateTags([...currentTags, ...tags])}
        />
      </div>
    </div>
  );
};

export default TagsWithDrawer;

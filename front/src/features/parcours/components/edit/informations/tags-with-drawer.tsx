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
import { splitAvailableTags } from "./tags-selector.helpers";
import { useRoleLabels } from "../../../../role/hooks/useRoleLabels";

interface TagsWithDrawerProps {
  loading: boolean;
  onSubmit: (items: Tag[]) => void;
  tags: Tag[];
  selectedTags?: Tag[];
  inheritedTagsLabel?: string;
  readOnly?: boolean;
}

const TagsWithDrawer = (props: TagsWithDrawerProps) => {
  const { teamLabel } = useRoleLabels();
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
  const lockedTagIds = currentTags
    .filter(({ canUnassign }) => canUnassign === false)
    .map(({ id }) => id);

  const handleUpdateTags = useCallback(
    (tags: Tag[]) => {
      setDraftTags(tags);
      onSubmit(tags);
    },
    [onSubmit],
  );

  // Tags hérités (formation) disponibles et pas encore sélectionnés.
  const missingInheritedTags = useMemo(() => {
    const selectedIds = new Set(currentTags.map(({ id }) => id));
    return splitAvailableTags(availableTags ?? [], props.tags).inheritedTags.filter(
      ({ id }) => !selectedIds.has(id),
    );
  }, [availableTags, props.tags, currentTags]);

  return (
    <div
      className="flex flex-col justify-between gap-y-4 h-full"
    >
      <span className="h-full flex-1">
        <InheritedItems
          drawerId="add-tags"
          drawerTitle="Ajouter des tags"
          title="Tags"
          loading={props.loading}
          initialList={availableTags ?? []}
          selectedItems={currentTags}
          lockedItemIds={lockedTagIds}
          property="name"
          onSubmit={handleUpdateTags}
          isDisabled={props.readOnly}
          headerActions={
            <button
              className="btn btn-sm btn-outline btn-primary"
              onClick={() =>
                handleUpdateTags([...currentTags, ...missingInheritedTags])
              }
              type="button"
              disabled={props.readOnly || missingInheritedTags.length === 0}
              title={
                props.readOnly
                  ? `Lecture seule pour le rôle « ${teamLabel} »`
                  : undefined
              }
            >
              <span>Ajouter tous les tags</span>
            </button>
          }
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
          disabled={props.readOnly}
          title={
            props.readOnly
              ? `Lecture seule pour le rôle « ${teamLabel} »`
              : undefined
          }
        >
          <Plus className="w-4 h-4" />
          <span>Créer de nouveaux tags</span>
        </button>
        {!props.readOnly ? (
          <CreateNewTag
            onCreated={(tags) => handleUpdateTags([...currentTags, ...tags])}
          />
        ) : null}
      </div>
    </div>
  );
};

export default TagsWithDrawer;

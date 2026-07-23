import Tag from "../../../../../../src/utils/interfaces/tag";
import CurrentTags from "../../../../../../src/components/shared/inherited-items/current-tags";
import InheritedItems from "../../../../../../src/components/shared/inherited-items/inherited-items";
import { useCallback, useMemo, useState } from "react";
import ParcoursTagsSelecter from "./parcours-tags-selecter";
import SearchTag from "./search-tag";
import CreateNewTag from "./create-new-tags";
import { HelpCircle } from "lucide-react";
import QuestionMarkTooltip from "../../../../../components/UI/question-mark-tooltip/question-mark-tooltip";
import { useParcoursTagsQuery } from "../../../hooks/useParcoursTagsQuery";
import { useParams } from "react-router";
import { useParcoursQuery } from "../../../hooks/useParcoursQuery";

interface TagsWithDrawerProps {
  loading: boolean;
  onSubmit: (items: Tag[]) => void;
  tags: Tag[];
}

const TagsWithDrawer = (props: TagsWithDrawerProps) => {
  const { data: availableTags } = useParcoursTagsQuery();
  const { id } = useParams();
  const { data: parcours } = useParcoursQuery(id ? Number(id) : undefined);
  const selectedParcoursTags = useMemo(
    () => {
      const tags = parcours?.tags as Array<Tag | { tag: Tag }> | undefined;
      return tags?.length
        ? tags.map((item) => ("tag" in item ? item.tag : item))
        : props.tags;
    },
    [parcours?.tags, props.tags],
  );
  const [draftTags, setDraftTags] = useState<Tag[] | null>(null);
  const currentTags = draftTags ?? selectedParcoursTags;
  const [parentTags] = useState<Tag[]>(props.tags);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredTags = useMemo(
    () =>
      searchTerm.length > 0
        ? (availableTags ?? []).filter((item) =>
            item.name.toLocaleLowerCase().includes(searchTerm.toLowerCase()),
          )
        : (availableTags ?? []),
    [availableTags, searchTerm],
  );

  const handleUpdateTags = useCallback(
    (tags: Tag[]) => {
      setDraftTags(tags);
      props.onSubmit(tags);
    },
    [props.onSubmit],
  );

  /**
   * Effect pour mettre à jour les tags de la formation
   * quand la formation change
   */
  /*  useEffect(() => {
    if (parent) {
      setParentTags(parent.tags.map((item: any) => item.tag));
    }
  }, [formation]);*/

  // Rendu du composant avec deux sections principales :
  // 1. Les tags actuels et les tags de la formation
  // 2. La liste complète des tags disponibles avec recherche
  return (
    <div className="flex flex-col justify-between gap-y-4 h-full">
      {/* Section des tags actuels */}
      <span className="h-full flex-1">
        <InheritedItems
          drawerId="add-tags"
          drawerTitle="Ajouter des Tags"
          title="Tags"
          loading={props.loading}
          initialList={parentTags}
          selectedItems={currentTags}
          property="name"
          onSubmit={handleUpdateTags}
        >
          <CurrentTags />
          <ParcoursTagsSelecter>
            <h2 className="text-xl font-semibold">
              Tags en lien avec la formation
            </h2>
          </ParcoursTagsSelecter>
        </InheritedItems>
      </span>

      {/* Section de tous les tags disponibles */}
      <div>
        <span className="flex flex-col items-start justify-end gap-x-8 gap-y-2 h-fit mt-4">
          <InheritedItems
            drawerId="all-tags"
            buttonLabel="Liste des tous les tags disponibles"
            drawerTitle="Ajouter des Tags"
            loading={props.loading}
            initialList={filteredTags}
            selectedItems={currentTags}
            property="name"
            onSubmit={handleUpdateTags}
            visibleList={false}
          >
            <></>
            <ParcoursTagsSelecter>
              <h2 className="text-xl font-semibold">Tous les tags</h2>
              <span className="flex gap-x-4 items-center">
                <SearchTag
                  searchTerm={searchTerm}
                  onSetSearchTerm={setSearchTerm}
                />
                <QuestionMarkTooltip
                  tooltipValue="Les tags aident à trouver du contenu par mots clés."
                  tooltipPosition="left"
                >
                  <HelpCircle className="w-6 h-6 text-primary" />
                </QuestionMarkTooltip>
              </span>
            </ParcoursTagsSelecter>
          </InheritedItems>
          <button
            className="pl-2 text-xs text-primary btn btn-ghost underline"
            onClick={() => document.getElementById("create-tags")?.click()}
          >
            ou Créer des nouveaux tags
          </button>
        </span>
        <CreateNewTag
          onCreated={(tags) => handleUpdateTags([...currentTags, ...tags])}
        />
      </div>
    </div>
  );
};

export default TagsWithDrawer;

import { useMemo, useState } from "react";
import { HelpCircle } from "lucide-react";
import Tag from "../../../../../../src/utils/interfaces/tag";
import QuestionMarkTooltip from "../../../../../components/UI/question-mark-tooltip/question-mark-tooltip";
import TagsList from "./tags-list";
import SearchTag from "./search-tag";
import { splitAvailableTags } from "./tags-selector.helpers";

interface Props {
  list?: Tag[];
  inheritedTags: Tag[];
  inheritedTagsLabel: string;
  onAddItems?: (items: number[]) => void;
  onCloseDrawer?: (id: string) => void;
}

const ParcoursTagsSelecter = (props: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const allAvailableTags = useMemo(
    () => splitAvailableTags(props.list ?? [], props.inheritedTags),
    [props.list, props.inheritedTags],
  );
  const visibleTags = useMemo(
    () =>
      splitAvailableTags(props.list ?? [], props.inheritedTags, searchTerm),
    [props.list, props.inheritedTags, searchTerm],
  );

  const handleAddTag = (id: number) => {
    props.onAddItems?.([id]);
  };

  const handleAddAllInheritedTags = () => {
    props.onAddItems?.(allAvailableTags.inheritedTags.map((tag) => tag.id));
  };

  return (
    <div className="w-[35rem] flex flex-col gap-y-4">
      <div className="flex gap-x-4 items-center">
        <SearchTag
          searchTerm={searchTerm}
          onSetSearchTerm={setSearchTerm}
        />
        <QuestionMarkTooltip
          tooltipValue="Les tags aident à trouver du contenu par mots-clés."
          tooltipPosition="left"
        >
          <HelpCircle className="w-6 h-6 text-primary" />
        </QuestionMarkTooltip>
      </div>

      <section className="flex flex-col gap-y-3">
        <div className="flex items-center justify-between gap-x-4">
          <h2 className="text-xl font-semibold">{props.inheritedTagsLabel}</h2>
          <button
            className="btn btn-sm btn-outline btn-primary"
            disabled={allAvailableTags.inheritedTags.length === 0}
            onClick={handleAddAllInheritedTags}
            type="button"
          >
            Tout ajouter
          </button>
        </div>
        {visibleTags.inheritedTags.length > 0 ? (
          <TagsList
            list={visibleTags.inheritedTags}
            onAddTag={handleAddTag}
          />
        ) : (
          <p className="text-sm text-base-content/70">
            {allAvailableTags.inheritedTags.length === 0
              ? "Tous les tags hérités sont déjà sélectionnés."
              : "Aucun tag hérité ne correspond à la recherche."}
          </p>
        )}
      </section>

      <div className="divider my-1" />

      <section className="flex flex-col gap-y-3">
        <h2 className="text-xl font-semibold">Tags globaux</h2>
        {visibleTags.globalTags.length > 0 ? (
          <TagsList list={visibleTags.globalTags} onAddTag={handleAddTag} />
        ) : (
          <p className="text-sm text-base-content/70">
            {allAvailableTags.globalTags.length === 0
              ? "Tous les tags globaux sont déjà sélectionnés."
              : "Aucun tag global ne correspond à la recherche."}
          </p>
        )}
      </section>
    </div>
  );
};
export default ParcoursTagsSelecter;

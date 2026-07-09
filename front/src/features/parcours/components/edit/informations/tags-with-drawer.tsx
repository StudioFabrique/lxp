import {
  useParcoursSelector,
  useParcoursDispatch,
} from "../../../store/ParcoursContext";
import Tag from "../../../../../../src/utils/interfaces/tag";
import CurrentTags from "../../../../../../src/components/inherited-items/current-tags";
import InheritedItems from "../../../../../../src/components/inherited-items/inherited-items";
import { useCallback, useEffect, useRef, useState } from "react";
import { autoSubmitTimer } from "../../../../../config/auto-submit-timer";
import toast from "react-hot-toast";
import ParcoursTagsSelecter from "./parcours-tags-selecter";
import SearchTag from "./search-tag";
import CreateNewTag from "./create-new-tags";
import { HelpCircle } from "lucide-react";
import { parcoursApi } from "../../../api/parcours.api";
import QuestionMarkTooltip from "../../../../../components/UI/question-mark-tooltip/question-mark-tooltip";

interface TagsWithDrawerProps {
  loading: boolean;
  onSubmit: (items: any[]) => void;
  tags: Tag[];
}

const TagsWithDrawer = (props: TagsWithDrawerProps) => {
  const currentTags = useParcoursSelector((state) => state.tags.currentTags);
  const initialTags = useParcoursSelector((state) => state.tags.initialTags);
  const dispatch = useParcoursDispatch();

  const [submit, setSubmit] = useState<boolean>(false);
  const hasFetchedTags = useRef(false);
  const [parentTags] = useState<Tag[]>(props.tags);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);

  const handleUpdateTags = useCallback(
    (tags: Tag[]) => {
      dispatch({ type: "SET_CURRENT_TAGS", payload: tags });
      setSubmit(true);
    },
    [dispatch],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (submit) {
        props.onSubmit(currentTags);
        setSubmit(false);
      }
    }, autoSubmitTimer);
    return () => clearTimeout(timer);
  }, [props, submit, currentTags]);

  useEffect(() => {
    if (!hasFetchedTags.current) {
      hasFetchedTags.current = true;
      parcoursApi.queries
        .getTags()
        .then((data) => {
          dispatch({ type: "INIT_TAGS", payload: data });
        })
        .catch(() => toast.error("Erreur lors du chargement des tags"));
    }
  }, [dispatch]);

  /**
   * Effect pour mettre à jour les tags de la formation
   * quand la formation change
   */
  /*  useEffect(() => {
    if (parent) {
      setParentTags(parent.tags.map((item: any) => item.tag));
    }
  }, [formation]);*/

  /**
   * Effect pour filtrer les tags en fonction du terme de recherche
   */
  useEffect(() => {
    if (searchTerm.length > 0)
      setFilteredTags(
        initialTags?.filter((item) =>
          item.name.toLocaleLowerCase().includes(searchTerm.toLowerCase()),
        ),
      );
    else setFilteredTags(initialTags);
  }, [searchTerm, initialTags]);

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
        <CreateNewTag onSubmit={setSubmit} />
      </div>
    </div>
  );
};

export default TagsWithDrawer;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import Tag from "../../../utils/interfaces/tag";
import CurrentTags from "../../inherited-items/current-tags";
import InheritedItems from "../../inherited-items/inherited-items";
import { useCallback, useEffect, useRef, useState } from "react";
import { tagsAction } from "../../../store/redux-toolkit/tags";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";
import useHttp from "../../../hooks/use-http";
import ParcoursTagsSelecter from "./parcours-tags-selecter";
import SearchTag from "./search-tag";
import CreateNewTag from "./create-new-tags";
import QuestionMarkTooltip from "../../UI/question-mark-tooltip/question-mark-tooltip";
import { HelpCircle } from "lucide-react";

// Interface définissant les props du composant
interface TagsWithDrawerProps {
  loading: boolean;
  onSubmit: (items: any[]) => void;
}

/**
 * Composant TagsWithDrawer
 * Gère l'affichage et la sélection des tags avec un système de drawer
 * Permet de voir les tags actuels, les tags de la formation et tous les tags disponibles
 */
const TagsWithDrawer = (props: TagsWithDrawerProps) => {
  // Récupération des données du state Redux
  const formation = useSelector((state: any) => state.parcours.formation);
  const currentTags = useSelector(
    (state: any) => state.tags.currentTags,
  ) as Tag[];
  const initialTags = useSelector(
    (state: any) => state.tags.initialTags,
  ) as Tag[];
  const dispatch = useDispatch();

  // États locaux
  const [submit, setSubmit] = useState<boolean>(false);
  const isInitialRender = useRef(true);
  const { sendRequest } = useHttp();
  const [formationTags, setFormationTags] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);

  /**
   * Met à jour la liste des tags sélectionnés dans le state Redux
   * et déclenche la soumission
   */
  const handleUpdateTags = useCallback(
    (tags: Tag[]) => {
      dispatch(tagsAction.setCurrentTags(tags));
      setSubmit(true);
    },
    [dispatch],
  );

  /**
   * Effect pour gérer la soumission automatique
   * Attend autoSubmitTimer ms avant de déclencher la soumission
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (submit) {
        props.onSubmit(currentTags);
        setSubmit(false);
      }
    }, autoSubmitTimer);
    return () => clearTimeout(timer);
  }, [props, submit, currentTags]);

  /**
   * Effect pour charger la liste initiale des tags depuis l'API
   * Ne s'exécute qu'au premier rendu
   */
  useEffect(() => {
    const processData = (data: Array<Tag>) => {
      dispatch(tagsAction.initTags(data));
    };
    if (isInitialRender.current) {
      sendRequest(
        {
          path: "/tag",
        },
        processData,
      );
    }
  }, [dispatch, sendRequest]);

  /**
   * Effect pour mettre à jour les tags de la formation
   * quand la formation change
   */
  useEffect(() => {
    if (formation) {
      setFormationTags(formation.tags.map((item: any) => item.tag));
    }
  }, [formation]);

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
          initialList={formationTags}
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
            buttonLabel="Liste des tous les tags dispnibles"
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
            className="pl-2 text-xs text-primary underline"
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

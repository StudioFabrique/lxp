/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import useHttp from "../../../hooks/use-http";
import { tagsAction } from "../../../store/redux-toolkit/tags";
import Tag from "../../../utils/interfaces/tag";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";
import SearchDropdown from "../search-dropdown/search-dropdown";
import TagItem from "../tag-item/tag-item";
import { parcoursInformationsAction } from "../../../store/redux-toolkit/parcours/parcours-informations";

type Props = {
  onSubmitTags: (tags: Array<Tag>) => void;
};

const Tags: FC<Props> = ({ onSubmitTags }) => {
  const { sendRequest } = useHttp();
  const currentTags = useSelector((state: any) => state.tags.currentTags);
  const notSelectedTags = useSelector(
    (state: any) => state.tags.notSelectedTags
  );
  const filteredItems = useSelector((state: any) => state.tags.filteredItems);
  const dispatch = useDispatch();
  const isInitialRender = useRef(true);

  /**
   * télécharge la liste de tous les tags depuis la bdd
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
        processData
      );
    }
  }, [dispatch, sendRequest]);

  /**
   * retire un tag de la liste des tags
   * @param tag Tag
   */
  const handleRemoveTag = (tag: Tag) => {
    dispatch(tagsAction.removeTag(tag.id));
  };

  /**
   * met à jour lo liste des tags non sélectionnés à partir des tags déjà sélectionnés pour éviter les doublons
   */
  useEffect(() => {
    dispatch(tagsAction.setNotSelectedTags());
    let isValid = false;
    if (currentTags.length > 0) {
      isValid = true;
    }
    dispatch(parcoursInformationsAction.setTagsIsValid(isValid));
  }, [currentTags, dispatch]);

  /**
   * réinitialise la liste des tags filtrés par la saisie de l'utilisateur dans le champ de recherche
   */
  const handleResetFilter = useCallback(() => {
    dispatch(tagsAction.resetFilteredItems());
  }, [dispatch]);

  /**
   * ajoute un tag dans la liste des tags sélectionnés
   */
  const handleAddTag = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (name: string, _property: string) => {
      const tag = notSelectedTags.find((item: Tag) => item.name === name);
      if (tag) {
        dispatch(tagsAction.addTag(tag.id));
        handleResetFilter();
      }
    },
    [notSelectedTags, dispatch, handleResetFilter]
  );

  /**
   * filtre la liste des tags sélectionnés en fonction des saisies de l'utilisateur dans le champ de rechercher
   */
  const handleFilterItems = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (value: string, _property: string) => {
      dispatch(tagsAction.filterItems(value));
    },
    [dispatch]
  );

  /**
   * initialise l'auto-submit après un court délai sans action de l'utilisateur pour sauvegarder les changements dans la bdd
   */
  useEffect(() => {
    let timer: any;
    if (!isInitialRender.current) {
      timer = setTimeout(() => {
        if (currentTags.length > 0) {
          onSubmitTags(currentTags);
        }
      }, autoSubmitTimer);
    } else {
      isInitialRender.current = false;
    }
    return () => {
      clearTimeout(timer);
    };
  }, [currentTags, onSubmitTags]);

  return (
    <div className="h-full flex flex-col gap-y-4">
      <h2 className="text-xl font-bold">Tags</h2>
      <SearchDropdown
        addItem={handleAddTag}
        filterItems={handleFilterItems}
        resetFilterItems={handleResetFilter}
        filteredItems={filteredItems}
        property="name"
        placeHolder="Ajouter un nouveau tag..."
      />
      <ul className="flex flex-wrap gap-2">
        {currentTags && currentTags.length > 0
          ? currentTags.map((tag: Tag) => (
              <li key={tag.id} onClick={() => handleRemoveTag(tag)}>
                <TagItem tag={tag} />
              </li>
            ))
          : null}
      </ul>
    </div>
  );
};

export default Tags;

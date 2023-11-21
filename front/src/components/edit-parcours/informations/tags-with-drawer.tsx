/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import Tag from "../../../utils/interfaces/tag";
import CurrentTags from "../../inherited-items/current-tags";
import InheritedItems from "../../inherited-items/inherited-items";
import NotSelectedTags from "../../inherited-items/not-selected-tags";
import { useCallback, useEffect, useRef, useState } from "react";
import useHttp from "../../../hooks/use-http";
import { tagsAction } from "../../../store/redux-toolkit/tags";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";

interface TagsWithDrawerProps {
  loading: boolean;
  onSubmit: (items: any[]) => void;
}

const TagsWithDrawer = (props: TagsWithDrawerProps) => {
  const currentTags = useSelector(
    (state: any) => state.tags.currentTags
  ) as Tag[];
  const initialTags = useSelector(
    (state: any) => state.tags.initialTags
  ) as Tag[];
  const isInitialRender = useRef(true);
  const { sendRequest } = useHttp();
  const dispatch = useDispatch();
  const [submit, setSubmit] = useState<boolean>(false);

  /**
   * met à jour la liste des tags sélectionnés dans le state partagé et
   */
  const handleUpdateTags = useCallback(
    (tags: Tag[]) => {
      setSubmit(true);
      dispatch(tagsAction.setCurrentTags(tags));
    },
    [dispatch]
  );

  /**
   * informe le composant parent qu'il peut initier une requête http pour
   * les enregistrer dans la bdd qd un changement dans la liste des tags
   * a été détecté suite à une action de l'utilisateur
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

  return (
    <InheritedItems
      drawerId="add-tags"
      drawerTitle="Ajouter des Tags"
      title="Tags"
      loading={props.loading}
      initialList={initialTags}
      selectedItems={currentTags}
      property="name"
      onSubmit={handleUpdateTags}
    >
      <CurrentTags />
      <NotSelectedTags />
    </InheritedItems>
  );
};

export default TagsWithDrawer;

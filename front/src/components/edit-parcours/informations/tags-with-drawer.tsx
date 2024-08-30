/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import Tag from "../../../utils/interfaces/tag";
import CurrentTags from "../../inherited-items/current-tags";
import InheritedItems from "../../inherited-items/inherited-items";
import { useCallback, useEffect, useRef, useState } from "react";
import { tagsAction } from "../../../store/redux-toolkit/tags";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";
import { Link } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import ParcoursTagsSelecter from "./parcours-tags-selecter";

interface TagsWithDrawerProps {
  loading: boolean;
  onSubmit: (items: any[]) => void;
}

type Item = {
  title: string;
  formationId?: number;
};

const TagsWithDrawer = (props: TagsWithDrawerProps) => {
  const formation = useSelector((state: any) => state.parcours.formation);
  const currentTags = useSelector(
    (state: any) => state.tags.currentTags,
  ) as Tag[];
  const initialTags = useSelector(
    (state: any) => state.tags.initialTags,
  ) as Tag[];
  const dispatch = useDispatch();
  const [submit, setSubmit] = useState<boolean>(false);
  const isInitialRender = useRef(true);
  const { sendRequest } = useHttp();
  const [formationTags, setFormationTags] = useState<Tag[]>([]);
  const [currentFormation, setCurrentFormation] = useState<Item | null>(null);

  console.log({ formation });

  /**
   * met à jour la liste des tags sélectionnés dans le state partagé et
   */
  const handleUpdateTags = useCallback(
    (tags: Tag[]) => {
      setSubmit(true);
      dispatch(tagsAction.setCurrentTags(tags));
    },
    [dispatch],
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
        processData,
      );
    }
  }, [dispatch, sendRequest]);

  useEffect(() => {
    if (formation) {
      setFormationTags(formation.tags.map((item: any) => item.tag));
    }
  }, [formation]);

  return (
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
      <ParcoursTagsSelecter
        formations={[]}
        formationId={1}
        onSearchTag={() => {}}
      >
        <div className="max-w-96">
          <p>
            Tous les tags en lien avec la formation ont été ajoutés au parcours.
            Si vous souhaitez créer de nouveau tags pour ce parcours il faut
            d'abord les ajouter à la formation en suivant ce{" "}
            {formation ? (
              <Link
                className="text-primary underline"
                to={`/admin/formation?formationId=${formation.id ?? ""}`}
              >
                lien
              </Link>
            ) : null}
            .
          </p>

          <p>
            Vous pouvez également ajouter des tags en lien avec d'autres
            formations en utilisant le menu déroulant.
          </p>
        </div>
      </ParcoursTagsSelecter>
    </InheritedItems>
  );
};

export default TagsWithDrawer;

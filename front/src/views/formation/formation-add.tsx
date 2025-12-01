// Imports des dépendances externes
import { useCallback, useEffect, useState } from "react";
import Wrapper from "../../components/UI/wrapper/wrapper.component";
import FormationAddForm from "../../components/formation-home/formation-add-form";
import Tag from "../../utils/interfaces/tag";
import useHttp from "../../hooks/use-http";
import toast from "react-hot-toast";
import FormationsList from "../../components/formation-home/formations-list";
import { sortArray } from "../../utils/sortArray";
import useForm from "../../components/UI/forms/hooks/use-form";
import useTags from "../../hooks/use-tags";
import FormationItem from "../../utils/interfaces/formation-item";
import { useSearchParams } from "react-router-dom";
import Header from "../../components/UI/header";

// Composant principal pour l'ajout/édition d'une formation
export default function FormationAdd() {
  // Récupération des paramètres de l'URL
  const [searchParams] = useSearchParams();
  const formationId = searchParams.get("formationId");

  // États locaux
  const [tags, setTags] = useState<Tag[]>([]); // Liste des tags disponibles
  const [formationsList, setFormationsList] = useState<FormationItem[]>([]); // Liste des formations
  const { sendRequest, error } = useHttp(); // Hook pour les requêtes HTTP
  const [submitting, setSubmitting] = useState(false); // État de soumission du formulaire
  const [formationToEdit, setFormationToEdit] = useState<FormationItem | null>( // Formation en cours d'édition
    null
  );

  // Hooks personnalisés pour la gestion du formulaire et des tags
  const {
    values,
    onChangeValue,
    onResetForm,
    errors,
    initValues,
    onValidationErrors,
  } = useForm();

  const {
    tag,
    currentTags,
    handleCheckTags,
    handleOnChange,
    handleRemoveTag,
    handleTagSubmit,
    resetTags,
    updatedTags,
    handleSetCurrentTags,
  } = useTags(tags);

  /**
   * Récupère la liste des tags depuis l'API
   */
  const getTags = useCallback(() => {
    const applyData = (data: Tag[]) => {
      setTags(data);
    };
    sendRequest(
      {
        path: "/tag",
      },
      applyData
    );
  }, [sendRequest]);

  /**
   * Sélectionne une formation pour l'édition
   * @param id Identifiant de la formation à éditer
   */
  const handleSelectFormation = useCallback(
    (id: number) => {
      const formation = formationsList.find((item) => item.id === id);
      if (formation) {
        setFormationToEdit(formation);
      }
    },
    [formationsList]
  );

  /**
   * Gère la création d'une nouvelle formation
   */
  const handleSubmit = (
    title: string,
    description: string,
    code: string,
    level: string,
    tags: Tag[]
  ) => {
    const applyData = (data: {
      success: boolean;
      message: string;
      response: FormationItem;
    }) => {
      if (data.success) {
        toast.success(data.message);
        setFormationsList((prevState) => [...prevState, data.response]);
      }
      setSubmitting(false);
      onResetForm();
      resetTags();
    };
    setSubmitting(true);
    sendRequest(
      {
        path: "/formation",
        method: "post",
        body: {
          title,
          description,
          code,
          level,
          tags: tags.map((item) => item.id),
        },
      },
      applyData
    );
  };

  /**
   * Gère la mise à jour d'une formation existante
   */
  const handleUpdate = (
    title: string,
    description: string,
    code: string,
    level: string,
    tags: Tag[]
  ) => {
    const applyData = (data: {
      success: boolean;
      message: string;
      response: FormationItem;
    }) => {
      if (data.success) {
        toast.success(data.message);
        let updatedList = formationsList.filter(
          (item) => item.id !== formationToEdit!.id
        );
        updatedList = sortArray([...updatedList, data.response], "id");
        setFormationsList(updatedList);
      }
      setSubmitting(false);
      setFormationToEdit(null);
      onResetForm();
      resetTags();
    };
    setSubmitting(true);
    sendRequest(
      {
        path: `/formation/${formationToEdit!.id}`,
        method: "put",
        body: {
          formation: {
            title,
            description,
            code,
            level,
            tags: tags.map((item) => item.id),
          },
        },
      },
      applyData
    );
  };

  /**
   * Récupère la liste des formations depuis l'API
   */
  const getFormationsList = useCallback(() => {
    const applyData = (data: {
      success: boolean;
      message: string;
      response: FormationItem[];
    }) => {
      setFormationsList(data.response);
    };
    sendRequest(
      {
        path: "/formation/list",
      },
      applyData
    );
  }, [sendRequest]);

  /**
   * Ajoute de nouveaux tags à la liste existante
   */
  const handleNewTags = (newTags: Tag[]) => {
    setTags((prevState) => [...prevState, ...newTags]);
  };

  /**
   * Annule l'édition en cours
   */
  const handleCancel = () => {
    setFormationToEdit(null);
  };

  // Effet pour charger les données initiales
  useEffect(() => {
    getTags();
    getFormationsList();
    return () => {
      setTags([]);
      setFormationsList([]);
    };
  }, [getTags, getFormationsList]);

  // Effet pour gérer la sélection d'une formation via l'URL
  useEffect(() => {
    if (formationId && !isNaN(+formationId))
      handleSelectFormation(+formationId);
  }, [formationId, handleSelectFormation]);

  // Effet pour gérer les erreurs HTTP
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
    setSubmitting(false);
  }, [error]);

  // Rendu du composant
  return (
    <div className="w-full flex flex-col gap-4">
      <Header
        title={
          formationToEdit
            ? "Mise à jour de la formation"
            : "Gestion de formations"
        }
        description={"Création et mise à jour des formations"}
      />

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-2">
        <article className="h-fit">
          <Wrapper>
            {formationToEdit ? (
              <FormationAddForm
                values={values}
                onChangeValue={onChangeValue}
                onResetForm={onResetForm}
                errors={errors}
                initValues={initValues}
                onValidationErrors={onValidationErrors}
                formation={formationToEdit}
                onSubmit={handleUpdate}
                onNewTags={handleNewTags}
                submitting={submitting}
                onCancel={handleCancel}
                tag={tag}
                currentTags={currentTags}
                handleOnChange={handleOnChange}
                handleCheckTags={handleCheckTags}
                handleRemoveTag={handleRemoveTag}
                handleTagSubmit={handleTagSubmit}
                resetTags={resetTags}
                updatedTags={updatedTags}
                handleSetCurrentTags={handleSetCurrentTags}
              />
            ) : (
              <FormationAddForm
                values={values}
                onChangeValue={onChangeValue}
                onResetForm={onResetForm}
                errors={errors}
                initValues={initValues}
                onValidationErrors={onValidationErrors}
                onSubmit={handleSubmit}
                onNewTags={handleNewTags}
                submitting={submitting}
                tag={tag}
                currentTags={currentTags}
                handleOnChange={handleOnChange}
                handleCheckTags={handleCheckTags}
                handleRemoveTag={handleRemoveTag}
                handleTagSubmit={handleTagSubmit}
                resetTags={resetTags}
                updatedTags={updatedTags}
                handleSetCurrentTags={handleSetCurrentTags}
              />
            )}
          </Wrapper>
        </article>
        <article>
          <FormationsList
            formationsList={formationsList}
            onSelect={handleSelectFormation}
          />
        </article>
      </section>
    </div>
  );
}

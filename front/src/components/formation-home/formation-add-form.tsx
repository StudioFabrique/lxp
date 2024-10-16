/* eslint-disable @typescript-eslint/no-explicit-any */
import Tag from "../../utils/interfaces/tag";
import Field from "../UI/forms/field";
import FieldArea from "../UI/forms/field-area";
import { postFormationSchema } from "../../lib/validation/post-formation-schema";
import { ZodError } from "zod";
import { validationErrors } from "../../helpers/validate";
import toast from "react-hot-toast";
import AddTag from "../UI/add-tag";
import Modal from "../UI/modal/modal";
import { ChangeEvent, useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";
import TagsList from "./tags-list";
import { Loader2 } from "lucide-react";
import CustomError from "../../utils/interfaces/custom-error";

type FormationItem = {
  id: number;
  title: string;
  description?: string;
  code: string;
  level: string;
  parcours: number;
  tags?: number[];
};

interface FormationAddFormProps {
  formation?: FormationItem;

  submitting: boolean;
  onSubmit: (
    title: string,
    description: string,
    level: string,
    code: string,
    tags: Tag[],
  ) => void;
  onCancel?: () => void;
  onNewTags: (newTags: Tag[]) => void;
  values: Record<string, string>;
  onChangeValue: (field: string, value: string) => void;
  onResetForm: () => void;
  errors: CustomError[];
  initValues: (data: any) => void;
  onValidationErrors: (data: CustomError[]) => void;
  tag: string;
  currentTags: Tag[];
  handleOnChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleCheckTags: () => Tag[];
  handleRemoveTag: (id: number) => void;
  handleTagSubmit: (event: React.FormEvent) => void;
  resetTags: () => void;
  updatedTags: (newTags: Tag[]) => Tag[];
  handleSetCurrentTags: (ids: number[]) => void;
}

export default function FormationAddForm({
  formation,
  submitting,
  onSubmit,
  onNewTags,
  onCancel,
  values,
  onChangeValue,
  onResetForm,
  errors,
  initValues,
  onValidationErrors,
  tag,
  currentTags,
  handleOnChange,
  handleCheckTags,
  handleRemoveTag,
  handleTagSubmit,
  resetTags,
  updatedTags,
  handleSetCurrentTags,
}: FormationAddFormProps) {
  const { sendRequest, error } = useHttp();

  const [showModal, setShowModal] = useState(false);
  const [newTags, setNewTags] = useState<Tag[]>([]);
  const [saving, setSaving] = useState(false);
  const [tagError, setTagError] = useState(false);

  const data = {
    values,
    onChangeValue,
    errors,
  };

  /**
   * enregistre la nouvelle formation dans la bdd
   * @param tags Tag[]
   */
  const handleSubmit = (tags: Tag[]) => {
    // envoi des données saisies vers le composant parent pour les soumettre au backend
    onSubmit(values.title, values.description, values.code, values.level, tags);
  };

  /**
   * Validation et soumission des données du formulaire
   * @param event React.FOrmEvent
   */
  const handleValidate = (event: React.FormEvent) => {
    event.preventDefault();

    setTagError(false);

    // vérification qu'au moins un tag est présent dans la liste des tags
    if (currentTags.length === 0) {
      setTagError(true);
      toast.error("Au moins un tag est requis pour enregistrer la formation.");
      return;
    }

    //validation du formulaire
    try {
      postFormationSchema.parse(values);
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errors = validationErrors(error);
        onValidationErrors(errors);
        return;
      }
    }

    // on filtre les tags qui n'existent pas dans la base de données
    const tmpTags = handleCheckTags();
    setNewTags(tmpTags);
    if (tmpTags.length > 0) {
      setShowModal(true);
    } else {
      handleSubmit(currentTags);
    }
  };

  /**
   * enregistre les tags dans la bdd qui ne sont pas déjà enregistrés
   */
  const handleSubmitNewTags = () => {
    const applyData = (data: Tag[]) => {
      onNewTags(data);
      const tags = updatedTags(data);
      setSaving(false);
      setShowModal(false);
      handleSubmit(tags);
    };
    setSaving(true);
    sendRequest(
      {
        path: "/tag",
        method: "post",
        body: {
          tags: newTags.map((item) => ({ name: item.name, color: item.color })),
        },
      },
      applyData,
    );
  };

  const handleCancel = () => {
    if (onCancel !== undefined) {
      onCancel();
    }
    resetTags();
    onResetForm();
  };

  useEffect(() => {
    if (formation !== undefined) {
      initValues({
        id: formation.id,
        title: formation.title,
        description: formation.description,
        code: formation.code,
        level: formation.level,
      });

      handleSetCurrentTags(formation.tags!);
    }
  }, [formation, handleSetCurrentTags, initValues]);

  /**
   * Réinitialise le state tagError qd l'utilisateur ajoute un tag à la formation
   * afin que la bordure rouger disparaisse de la zone de saisie des tags
   * @param event React.FormEvent
   */
  const resetStyle = (event: React.FormEvent) => {
    setTagError(false);
    handleTagSubmit(event);
  };

  /**
   * gestion des erreurs http
   */
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
      setSaving(false);
      setShowModal(false);
    }
  }, [error]);

  useEffect(() => {
    return () => console.log("unmounting");
  }, []);

  console.log({ tagError });

  return (
    <>
      <form className="flex flex-col gap-y-4">
        <Field
          placeholder="Nom de la formation"
          label="Formation"
          data={data}
          name="title"
        />

        <FieldArea data={data} name="description" label="Description" />

        <Field
          data={data}
          name="code"
          label="RNCP"
          placeholder="Exemple : 35357"
        />

        <Field
          data={data}
          name="level"
          placeholder="Exemple : Niveau III"
          label="Niveau"
        />
      </form>

      <AddTag
        error={tagError}
        tag={tag}
        placeholder="Exemple : artisanal, technologie, industriel"
        onChangeValue={handleOnChange}
        onSubmit={resetStyle}
      />

      <TagsList tagsList={currentTags} onRemove={handleRemoveTag} />

      <div className="w-full flex justify-between">
        <button className="btn btn-outline btn-primary" onClick={handleCancel}>
          Annuler
        </button>
        <button
          className="btn btn-primary"
          disabled={saving}
          onClick={handleValidate}
        >
          {submitting ? (
            <span className="flex items-center gap-x-2">
              <Loader2 className="animate animate-spin" />
              <p>Sauvegarde en cours...</p>
            </span>
          ) : (
            <span>Sauvegarde</span>
          )}
        </button>
      </div>
      {showModal ? (
        <Modal
          isSubmitting={saving}
          title="Sauvegarder les nouveaux tags"
          leftLabel="Annuler"
          onLeftClick={() => setShowModal(false)}
          rightLabel="Sauvegarder"
          onRightClick={handleSubmitNewTags}
        >
          <p className="my-4">
            Les tags suivants n'existent pas encore, souhaitez vous les
            sauvegarder ?
          </p>
          <TagsList tagsList={newTags} />
        </Modal>
      ) : null}
    </>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import Tag from "../../utils/interfaces/tag";
import Field from "../UI/forms/field";
import FieldArea from "../UI/forms/field-area";
import useForm from "../UI/forms/hooks/use-form";
import { postFormationSchema } from "../../lib/validation/post-formation-schema";
import { ZodError } from "zod";
import { validationErrors } from "../../helpers/validate";
import toast from "react-hot-toast";
import TagItem from "../UI/tag-item/tag-item";
import useTags from "../../hooks/use-tags";
import AddTag from "../UI/add-tag";
import Modal from "../UI/modal/modal";
import { useState } from "react";
import useHttp from "../../hooks/use-http";

interface FormationAddFormProps {
  initialTags: Tag[];
  onSubmit: (
    title: string,
    description: string,
    level: string,
    code: string,
    tags: Tag[]
  ) => void;
  onNewTags: (newTags: Tag[]) => void;
}

export default function FormationAddForm({
  initialTags,
  onSubmit,
  onNewTags,
}: FormationAddFormProps) {
  const { sendRequest } = useHttp();
  const { values, onChangeValue, onResetForm, errors, onValidationErrors } =
    useForm();
  const {
    tag,
    currentTags,
    handleCheckTags,
    handleOnChange,
    handleRemoveTag,
    handleTagSubmit,
    resetTags,
  } = useTags(initialTags);
  const [showModal, setShowModal] = useState(false);
  const [newTags, setNewTags] = useState<Tag[]>([]);

  const data = {
    values,
    onChangeValue,
    errors,
  };

  /**
   * met à jour la liste des tags sélectionnés
   * @param tags Tag[]
   */

  /**
   * Validation et soumission des données du formulaire
   * @param event React.FOrmEvent
   */
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    //validation du formulaire
    try {
      postFormationSchema.parse(values);
    } catch (error: any) {
      if (error instanceof ZodError) {
        console.log({ error });
        const errors = validationErrors(error);
        onValidationErrors(errors);
        return;
      }
    }
    // vérification qu'au moins un tag est présent dans la liste des tags
    if (currentTags.length === 0) {
      toast.error("Au moins un tag est requis pour enregistrer la formation.");
      return;
    }
    setNewTags(handleCheckTags());
    if (newTags.length > 0) setShowModal(true);

    // envoi des données saisies vers le composant parent pour les soumettre au backend
    /*     onSubmit(
      values.title,
      values.description,
      values.code,
      values.level,
      currentTags
    ); */
  };

  /*   const handleReset = () => {
    onResetForm();
    setCurrentTags([]);
  }; */

  const handleSubmitNewTags = () => {
    const applyData = (data: Tag[]) => {
      onNewTags(data);
    };
    sendRequest(
      {
        path: "/tag",
        method: "post",
      },
      applyData
    );
  };

  const tagsList = (
    <ul className="flex flex-wrap gap-2">
      {currentTags.map((item) => (
        <li key={item.id} onClick={() => handleRemoveTag(item.id)}>
          <TagItem tag={item} />
        </li>
      ))}
    </ul>
  );

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
        tag={tag}
        onChangeValue={handleOnChange}
        onSubmit={handleTagSubmit}
      />

      {tagsList}

      <div className="w-full flex justify-between">
        <button className="btn btn-outline btn-primary" onClick={() => {}}>
          Annuler
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Sauvegarder
        </button>
      </div>
      {showModal ? (
        <Modal
          title="Sauvegarder les nouveaux tags"
          leftLabel="Annuler"
          onLeftClick={() => setShowModal(false)}
          rightLabel="Sauvegarder"
          onRightClick={() => {}}
        >
          <p className="my-4">
            Les tags suivant n'existent pas encore, souhaitez vous les
            sauvegarder ?
          </p>
          {tagsList}
        </Modal>
      ) : null}
    </>
  );
}

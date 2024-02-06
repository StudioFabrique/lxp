/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import Tag from "../../../utils/interfaces/tag";
import Field from "../../UI/forms/field";
import FieldArea from "../../UI/forms/field-area";
import useForm from "../../UI/forms/hooks/use-form";
import CurrentTags from "../../inherited-items/current-tags";
import InheritedItems from "../../inherited-items/inherited-items";
import NotSelectedTags from "../../inherited-items/not-selected-tags";
import { postFormationSchema } from "../../../lib/validation/post-formation-schema";
import { ZodError } from "zod";
import { validationErrors } from "../../../helpers/validate";
import toast from "react-hot-toast";

interface FormationAddFormProps {
  initialTags: Tag[];
}

export default function FormationAddForm({
  initialTags,
}: FormationAddFormProps) {
  const {
    values,
    onChangeValue,
    //onResetForm,
    errors,
    onValidationErrors,
  } = useForm();
  const [currentTags, setCurrentTags] = useState<Tag[]>([]);

  const data = {
    values,
    onChangeValue,
    errors,
  };

  const handleUpdateTags = (tags: Tag[]) => {
    setCurrentTags(tags);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
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
    if (currentTags.length === 0) {
      toast.error("Au moins un tag est requis pour enregistrer la formation.");
    }
  };

  return (
    <>
      <form className="flex flex-col gap-y-4 font-bold">
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
      </form>{" "}
      <InheritedItems
        drawerId="add-tags"
        drawerTitle="Ajouter des Tags"
        title="Tags"
        loading={false}
        initialList={initialTags}
        selectedItems={currentTags}
        property="name"
        onSubmit={handleUpdateTags}
      >
        <CurrentTags />
        <NotSelectedTags />
      </InheritedItems>{" "}
      <div className="w-full flex justify-between">
        <button className="btn btn-outline btn-primary" type="reset">
          Annuler
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Sauvegarder
        </button>
      </div>
    </>
  );
}

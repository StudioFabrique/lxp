import { FormEvent, ReactNode, useMemo } from "react";

import Tag from "../../../utils/interfaces/tag";
import TagItem from "../../UI/tag-item/tag-item";
import LessonTags from "./lesson-tag";

interface LessonFormProps {
  children: ReactNode;
  title: unknown;
  description: unknown;
  mode: string;
  tag: Tag | null;
  tags: Tag[];
  isLoading: boolean;
  onSetTag: (value: Tag) => void;
  onSubmitLesson: () => void;
  onSetMode: (value: string) => void;
}

const LessonForm = (props: LessonFormProps) => {
  const { title, description } = props as any;

  const fields = useMemo(() => {
    return [title, description];
  }, [title, description]);

  /**
   * définit le style du champ formulaire en fonction de sa validité
   * @param hasError boolean
   * @returns string
   */
  const setInputStyle = (hasError: boolean) => {
    return hasError
      ? "input input-error text-error input-sm input-bordered focus:outline-none w-full"
      : "input input-sm input-bordered focus:outline-none w-full";
  };

  /**
   * définit le style du champ formulaire en fonction de sa validité
   * @param hasError boolean
   * @returns string
   */
  const setAreaStyle = (hasError: boolean) => {
    return hasError
      ? "textarea textarea-error text-error textarea-sm textarea-bordered focus:outline-none w-full"
      : "textarea textarea-sm textarea-bordered focus:outline-none w-full";
  };

  const formIsValid = title.isValid && description.isValid && props.tag;

  /**
   * Vérifie la validité du formulaire, s'il n'est pas valide affiche
   * les erreurs
   * @param event FormEvent
   */
  const handleSubmitForm = (event: FormEvent) => {
    event.preventDefault();
    if (formIsValid) {
      props.onSubmitLesson();
    } else {
      fields.forEach((field: any) => field.isSubmitted());
    }
  };

  /**
   * Gère le changement d'état du groupe de boutons radio
   * @param event React.FormEvent<HTMLInputElement>
   */
  const handleModeChange = (event: React.FormEvent<HTMLInputElement>) => {
    props.onSetMode(event.currentTarget.value);
  };

  return (
    <form className="flex flex-col gap-y-8" onSubmit={handleSubmitForm}>
      <div className="flex flex-col gap-y-4">
        <label className="font-bold" htmlFor="title">
          Titre de la leçon *
        </label>
        <input
          className={setInputStyle(title.hasError)}
          id="title"
          name="title"
          type="text"
          defaultValue={title.value}
          onChange={title.valueChangeHandler}
          onBlur={title.valueBlurHandler}
          placeholder="Exemple: Introduction au HTML"
        />
      </div>

      <div className="flex flex-col gap-y-4">
        <label className="font-bold" htmlFor="description">
          Description
        </label>
        <textarea
          className={setAreaStyle(description.hasError)}
          id="description"
          name="description"
          rows={5}
          defaultValue={description.value}
          onChange={description.textAreaChangeHandler}
          onBlur={description.valueBlurHandler}
        />
      </div>

      <div className="flex flex-col gap-y-4">
        <span className="w-full flex justify-between items-center">
          <p className="font-bold">Tag</p>
          <LessonTags list={props.tags} onAddItems={props.onSetTag} />
        </span>{" "}
        {props.tag ? (
          <div className="input py-8 flex items-center">
            <TagItem tag={props.tag} />
          </div>
        ) : (
          <p className="text-xs">Aucun tag sélectionné</p>
        )}
      </div>

      <div className="flex flex-col gap-y-4">
        <h2>Modalité</h2>
        <span className="w-full grid grid-cols-3 gap-4">
          <label
            className="w-full flex gap-x-4 items-center input"
            htmlFor="mode"
          >
            <input
              type="radio"
              name="mode"
              value="presentielle"
              checked={props.mode === "presentielle"}
              onChange={(e) => handleModeChange(e)}
            />
            Presentielle
          </label>

          <label
            className="w-full flex gap-x-4 items-center input"
            htmlFor="mode"
          >
            <input
              type="radio"
              name="mode"
              value="distancielle"
              checked={props.mode === "distancielle"}
              onChange={(e) => handleModeChange(e)}
            />
            Distancielle
          </label>

          <label
            className="w-full flex gap-x-4 items-center input"
            htmlFor="mode"
          >
            <input
              type="radio"
              name="mode"
              value="hybride"
              checked={props.mode === "hybride"}
              onChange={(e) => handleModeChange(e)}
            />
            Hybride
          </label>
        </span>
      </div>

      {props.children}
    </form>
  );
};

export default LessonForm;

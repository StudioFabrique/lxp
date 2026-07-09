/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FormEvent, ReactNode, useMemo } from "react";
import toast from "react-hot-toast";

import Tag from "../../../../../../src/utils/interfaces/tag";
import LessonTags from "./lesson-tag";
import TagItem from "../../../../../components/UI/tag-item/tag-item";

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

const LessonForm = React.forwardRef<HTMLInputElement, LessonFormProps>(
  (props, ref) => {
    const { title, description } = props as any;

    const fields = useMemo(() => {
      return [title, description];
    }, [title, description]);

    const setInputStyle = (hasError: boolean) => {
      return hasError
        ? "input input-error text-error input-sm input-bordered focus:outline-none w-full"
        : "input input-sm input-bordered focus:outline-none w-full";
    };

    const setAreaStyle = (hasError: boolean) => {
      return hasError
        ? "textarea textarea-error text-error textarea-sm textarea-bordered focus:outline-none w-full"
        : "textarea textarea-sm textarea-bordered focus:outline-none w-full";
    };

    const formIsValid = title.isValid && description.isValid && props.tag;

    const handleSubmitForm = (event: FormEvent) => {
      if (!props.tag) {
        toast.error("Veuillez choisir un tag pour la leçon svp");
      }
      event.preventDefault();
      if (formIsValid) {
        props.onSubmitLesson();
      } else {
        fields.forEach((field: any) => field.isSubmitted());
      }
    };

    const handleModeChange = (event: React.FormEvent<HTMLInputElement>) => {
      props.onSetMode(event.currentTarget.value);
    };

    return (
      <form
        className="w-full flex flex-col gap-y-8"
        onSubmit={handleSubmitForm}
      >
        <div className="flex flex-col gap-y-4">
          <label className="font-bold" htmlFor="title">
            Titre du contenu *
          </label>
          <input
            className={setInputStyle(title.hasError)}
            ref={ref}
            id="title"
            name="title"
            type="text"
            value={title.value}
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
            value={description.value}
            onChange={description.textAreaChangeHandler}
            onBlur={description.valueBlurHandler}
          />
        </div>

        <div className="w-full flex flex-col gap-y-4">
          <span className="w-full flex justify-between items-center gap-x-2">
            <p className="flex-1 font-bold">Tag *</p>
            <div>
              <LessonTags list={props.tags} onAddItems={props.onSetTag} />
            </div>
          </span>
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
              className="w-full flex gap-x-4 items-center border border-neutral-300/50 bg-base-300/50 rounded-md p-2"
              htmlFor="mode-presentiel"
            >
              <input
                className="radio radio-sm focus:outline-none"
                type="radio"
                name="mode"
                value="presentiel"
                checked={props.mode === "presentiel"}
                onChange={(e) => handleModeChange(e)}
              />
              Presentiel
            </label>

            <label
              className="w-full flex gap-x-4 items-center border border-neutral-300/50 bg-base-300/50 rounded-md p-2"
              htmlFor="mode-distanciel"
            >
              <input
                className="radio radio-sm focus:outline-none"
                type="radio"
                name="mode-distanciel"
                value="distanciel"
                checked={props.mode === "distanciel"}
                onChange={(e) => handleModeChange(e)}
              />
              Distanciel
            </label>

            <label
              className="w-full flex gap-x-4 items-center border border-neutral-300/50 bg-base-300/50 rounded-md p-2"
              htmlFor="mode-hybride"
            >
              <input
                className="radio radio-sm focus:outline-none"
                type="radio"
                name="mode-hybride"
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
  }
);

export default LessonForm;

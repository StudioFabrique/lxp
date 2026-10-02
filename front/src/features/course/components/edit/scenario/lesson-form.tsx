import React, { ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { LessonFormValues } from "../../../../module-preview/components/sidebar/lesson-form.types";

import Tag from "../../../../../../src/utils/interfaces/tag";
import LessonTags from "./lesson-tag";
import TagItem from "../../../../../components/UI/tag-item/tag-item";
import { cn } from "../../../../../utils/cn";

interface LessonFormProps {
  children: ReactNode;
  form: UseFormReturn<LessonFormValues>;
  mode: string;
  tag: Tag | null;
  tags: Tag[];
  isLoading: boolean;
  onSetTag: (value: Tag) => void;
  onSubmitLesson: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  onSetMode: (value: string) => void;
}

const LessonForm = React.forwardRef<HTMLInputElement, LessonFormProps>(
  (props, ref) => {
    const { register, formState: { errors } } = props.form;
    const setInputStyle = (hasError: boolean) => cn("input input-sm input-bordered focus:outline-none w-full", hasError && "input-error text-error");
    const setAreaStyle = (hasError: boolean) => cn("textarea textarea-sm textarea-bordered focus:outline-none w-full", hasError && "textarea-error text-error");
    const handleModeChange = (event: React.FormEvent<HTMLInputElement>) => {
      props.onSetMode(event.currentTarget.value);
    };

    return (
      <form
        className="w-full flex flex-col gap-y-8"
        onSubmit={props.onSubmitLesson}
      >
        <div className="flex flex-col gap-y-4">
          <label className="font-bold" htmlFor="title">
            Titre du contenu *
          </label>
          <input
            className={setInputStyle(Boolean(errors.title))}
            {...register("title")}
            ref={(element) => { register("title").ref(element); if (typeof ref === "function") ref(element); else if (ref) ref.current = element; }}
            id="title"
            type="text"
            placeholder="Exemple: Introduction au HTML"
          />
        </div>

        <div className="flex flex-col gap-y-4">
          <label className="font-bold" htmlFor="description">
            Description <span className="font-normal opacity-60">(optionnelle)</span>
          </label>
          <textarea
            className={setAreaStyle(Boolean(errors.description))}
            id="description"
            rows={5}
            {...register("description")}
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

import React, { ChangeEvent } from "react";
import QuestionMarkTooltip from "./question-mark-tooltip/question-mark-tooltip";
import { HelpCircle } from "lucide-react";

interface AddTagProps {
  tag: string;
  placeholder?: string;
  error: boolean;
  onChangeValue: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export default function AddTag(props: AddTagProps) {
  const handleTagSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    props.onSubmit(event);
  };

  const style = `input input-sm focus:outline-none w-full ${
    props.error ? "input-error" : ""
  }`;

  return (
    <form
      className="flex flex-col items-start w-full gap-y-2"
      onSubmit={handleTagSubmit}
    >
      <label>Tags</label>
      <span className="flex items-center gap-x-2 w-full">
        <input
          className={style}
          type="text"
          placeholder={props.placeholder ?? ""}
          value={props.tag}
          onChange={props.onChangeValue}
        />
        <QuestionMarkTooltip
          tooltipValue="Les tags aident à trouver du contenu par mots clés."
          tooltipPosition="left"
        >
          <HelpCircle className="w-6 h-6 text-primary" />
        </QuestionMarkTooltip>
      </span>
      <p className="text-xs text-secondary pl-1">
        Appuyer sur la touche "Entrée" après avoir saisi un nom de tag pour
        l'ajouter à la liste.
      </p>
    </form>
  );
}

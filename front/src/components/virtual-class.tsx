import { useEffect, useId } from "react";
import { HelpCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { optionalWebUrl } from "../utils/validation/fields";
import useAutoSave from "../hooks/useAutoSave";
import QuestionMarkTooltip from "./UI/question-mark-tooltip/question-mark-tooltip";

const schema = z.object({ url: z.string().trim().pipe(optionalWebUrl) });
interface VirtualClassProps {
  value: string;
  onSave: (url: string) => Promise<void>;
  disabled?: boolean;
}
export default function VirtualClass({
  value,
  onSave,
  disabled = false,
}: VirtualClassProps) {
  const id = useId();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { url: value },
    mode: "onChange",
  });
  const {
    reset,
    formState: { errors, dirtyFields },
  } = form;
  void dirtyFields;
  useEffect(() => {
    reset({ url: value }, { keepDirtyValues: true });
  }, [value, reset]);
  const save = async () => {
    if (!(await form.trigger())) throw new Error("Lien invalide");
    await onSave(schema.parse(form.getValues()).url);
  };
  useAutoSave(form.watch, save, !disabled);
  return (
    <div className="w-full flex flex-col gap-y-2">
      <label htmlFor={id} className="font-bold">
        Classe Virtuelle
      </label>
      <span className="flex items-center gap-x-2 w-full">
        <input
          {...form.register("url")}
          id={id}
          className="flex-1 input input-sm focus:outline-none"
          aria-invalid={!!errors.url}
          aria-describedby={errors.url ? `${id}-error` : undefined}
          placeholder="Lien vers la classe virtuelle"
          disabled={disabled}
        />
        <QuestionMarkTooltip
          tooltipValue="Si vous gérez une classe virtuelle sur Zoom, Google meet, Teams … vous pouvez saisir le lien ici."
          tooltipPosition="left"
        >
          <HelpCircle className="w-6 h-6 text-primary" />
        </QuestionMarkTooltip>
      </span>
      {errors.url && (
        <p id={`${id}-error`} className="text-error text-xs">
          {errors.url.message}
        </p>
      )}
    </div>
  );
}

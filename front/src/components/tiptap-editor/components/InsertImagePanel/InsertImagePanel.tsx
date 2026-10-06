import { useId, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import type { UrlEditorSize } from "../useUrlEditorState";
import { cn } from "../../../../utils/cn";
import { imageInsertSchema, imageUploadOptionsSchema, type ImageInsertValues } from "./image.schema";

export type InsertImagePanelProps = {
  initialUrl?: string;
  initialSize?: UrlEditorSize;
  onSetLink: (url: string, size: UrlEditorSize) => void;
  onClickUpload?: (size: UrlEditorSize) => void;
};

const sizes = [
  { value: "small", label: "Petit", width: "25 %" },
  { value: "medium", label: "Moyen", width: "50 %" },
  { value: "large", label: "Grand", width: "100 %" },
] as const;

export const InsertImagePanel = ({
  onSetLink,
  initialUrl = "",
  initialSize = "medium",
  onClickUpload,
}: InsertImagePanelProps) => {
  const id = useId();
  const uploadRequested = useRef(false);
  const {
    register,
    control,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ImageInsertValues>({
    resolver: (values, context, options) => zodResolver(
      uploadRequested.current ? imageUploadOptionsSchema : imageInsertSchema,
    )(values, context, options),
    defaultValues: { url: initialUrl, size: initialSize },
  });
  const selectedSize = useWatch({ control, name: "size" });

  return (
    <div className="space-y-4 text-base-content">
      <div>
        <h3 className="font-semibold">Insérer une image</h3>
        <p className="mt-1 text-xs text-base-content/60">Choisissez sa largeur, puis sa source.</p>
      </div>
      <fieldset>
        <legend className="mb-2 text-xs font-medium text-base-content/70">Largeur dans le contenu</legend>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map(({ value, label, width }) => (
            <label key={value} htmlFor={`${id}-${value}`} className={cn(
              "btn h-auto min-h-0 flex-col gap-1 rounded-lg px-2 py-2 font-medium has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary",
              selectedSize === value ? "btn-primary" : "btn-soft",
            )}>
              <input id={`${id}-${value}`} type="radio" value={value} className="sr-only" {...register("size")} />
              <span>{label}</span>
              <span className="text-xs opacity-70">{width}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <form noValidate onSubmit={(event) => {
        uploadRequested.current = false;
        void handleSubmit(({ url, size }) => onSetLink(url, size))(event);
      }} className="space-y-2">
        <label htmlFor={`${id}-url`} className="text-xs font-medium text-base-content/70">Adresse de l'image</label>
        <input
          id={`${id}-url`}
          type="url"
          placeholder="https://exemple.fr/image.jpg"
          className={cn("input input-sm w-full", errors.url && "input-error")}
          aria-invalid={!!errors.url}
          aria-describedby={errors.url ? `${id}-error` : undefined}
          {...register("url")}
        />
        {errors.url && <p id={`${id}-error`} className="text-xs text-error">{errors.url.message}</p>}
        <Button type="submit" className="w-full" disabled={isSubmitting}>Insérer l'image</Button>
      </form>
      {onClickUpload && <>
        <div className="divider my-0 text-xs text-base-content/50" aria-hidden="true">ou</div>
        <Button type="button" variant="quaternary" className="w-full" onClick={() => {
          uploadRequested.current = true;
          clearErrors("url");
          void handleSubmit(({ size }) => onClickUpload(size))();
        }} disabled={isSubmitting}>
          <Icon name="Image" className="h-4 w-4" />
          Choisir un fichier
        </Button>
      </>}
    </div>
  );
};

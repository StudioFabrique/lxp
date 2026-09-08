import { useState } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import ImageFileUpload, {
  type TemporaryImage,
} from "../../../../../components/UI/image-file-upload/image-file-upload";
import { headerImageMaxSize } from "../../../../../config/images-sizes";
import ModuleFields from "./ModuleFields";
import FormNumberInput from "../../../../../components/form/FormNumberInput";
import TrophyIcon from "../../../../../components/UI/svg/trophy-icon.component";
import type Skill from "../../../../../utils/interfaces/skill";
import type { ModuleCreateFormValues } from "../../../parcours.schema";

type ModuleFormProps = {
  mode: "create" | "edit";
  register: UseFormRegister<ModuleCreateFormValues>;
  errors: FieldErrors<ModuleCreateFormValues>;
  isSubmitting: boolean;
  duplicatedSkills?: Skill[];
  existingImage?: string | null;
  onSetFile: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

/**
 * Form component for creating or editing a module's general information.
 */
export default function ModuleForm({
  mode,
  register,
  errors,
  isSubmitting,
  duplicatedSkills,
  existingImage,
  onSetFile,
  onSubmit,
  onCancel,
}: ModuleFormProps) {
  const [temporaryImage, setTemporaryImage] = useState<TemporaryImage>({
    file: null,
    url: null,
  });

  const handleTemporaryImageChange = (image: TemporaryImage) => {
    setTemporaryImage(image);
    onSetFile(image.file);
  };

  return (
    <>
      <form
        id="module-form"
        className="mt-6 min-h-0 flex-1 overflow-y-auto"
        data-onboarding="module-form"
        onSubmit={onSubmit}
        noValidate
      >
        <section className="mx-auto flex max-w-3xl min-w-0 flex-col gap-5">
          <header>
            <h4 className="font-semibold">Informations générales</h4>
            <p className="mt-1 text-sm text-base-content/60">
              Définissez le contenu et la durée estimée du module.
            </p>
          </header>

          <ModuleFields register={register} errors={errors}>
            <div data-onboarding="module-duration-field">
              <FormNumberInput
                label="Durée du module en heures *"
                name="duration"
                placeholder="Ex : 12"
                min={0}
                helperText="Saisissez une durée supérieure à 0. Les valeurs décimales sont acceptées."
                register={register}
                error={errors.duration}
              />
            </div>
          </ModuleFields>

          <div
            className="flex flex-col gap-3"
            data-onboarding="module-image-field"
          >
            <p className="text-sm font-bold">
              {mode === "edit"
                ? "Modifier l’image du module"
                : "Image du module"}
            </p>
            <ImageFileUpload
              temporaryImage={temporaryImage}
              onSetTemporaryImage={handleTemporaryImageChange}
              existingImage={existingImage ?? undefined}
              maxSize={headerImageMaxSize}
              variant="image"
            >
              Téléverser une image
            </ImageFileUpload>
            <p className="text-xs text-base-content/60">
              JPG, PNG, WebP ou GIF — 1 Mo maximum.
              {mode === "create" && !temporaryImage.file
                ? " Une image sera générée automatiquement si aucune image n’est téléversée."
                : null}
            </p>
          </div>

          {duplicatedSkills ? (
            <div className="rounded-box border border-base-300 bg-base-200/50 p-4">
              <h4 className="text-sm font-semibold">Compétences dupliquées</h4>
              <p className="mt-1 text-xs text-base-content/55">
                Ces compétences proviennent du module source et sont affichées
                en lecture seule.
              </p>
              {duplicatedSkills.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {duplicatedSkills.map((skill, index) => (
                    <div
                      key={skill.id ?? `${skill.description}-${index}`}
                      className="tooltip tooltip-top"
                      data-tip={skill.description}
                    >
                      <div className="flex size-11 items-center justify-center rounded-lg bg-secondary/10 p-1.5">
                        {skill.badge ? (
                          <img
                            src={skill.badge}
                            alt=""
                            className="size-full object-contain"
                          />
                        ) : (
                          <span
                            className="size-6 text-primary"
                            aria-hidden="true"
                          >
                            <TrophyIcon />
                          </span>
                        )}
                        <span className="sr-only">{skill.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-base-content/55">
                  Aucune compétence du module source n’est disponible dans ce
                  parcours.
                </p>
              )}
            </div>
          ) : null}
        </section>
      </form>
      <footer className="relative z-10 -mx-5 mt-6 flex shrink-0 justify-end gap-3 border-t border-base-300 bg-base-100 px-5 pb-5 pt-4 sm:-mx-7 sm:px-7 sm:pb-7">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </button>
        <button
          data-onboarding="module-save"
          type="submit"
          form="module-form"
          className="btn btn-primary min-w-44"
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <span className="loading loading-spinner loading-sm" />
          )}
          {isSubmitting ? "Enregistrement..." : "Enregistrer le module"}
        </button>
      </footer>
    </>
  );
}

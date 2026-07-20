import { UseFormRegister } from "react-hook-form";
import FormInput from "../../../../components/form/FormInput";
import ResourceIFramePreview from "./ResourceIFramePreview";

type Props = {
  src: string;
  cleanedUrl: string;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  data: {
    register: UseFormRegister<any>;
    errors: any;
  };
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function ResourceIFrameForm(props: Props) {
  return (
    <form className="flex flex-col gap-y-4" onSubmit={props.onSubmit}>
      {/* Title input field with validation */}
      <FormInput
        register={props.data.register}
        name="title"
        label="Titre"
        placeholder="Titre de l'activité"
        error={props.data.errors.title}
      />

      {/* URL input field */}
      <label className="text-sm font-bold">
        <span className="label-text">URL</span>
      </label>
      <input
        className="w-full input input-bordered focus:outline-none disabled:cursor-not-allowed disabled:text-base-content/60"
        type="text"
        name="url"
        value={props.src ? props.src : ""}
        onChange={props.onUrlChange}
        placeholder="URL de l'iframe"
      />

      {/* Form action buttons */}
      <div className="flex justify-end gap-x-4">
        <button
          className="btn btn-outline btn-secondary"
          type="button"
          onClick={props.onCancel}
        >
          Annuler
        </button>
        <button className="btn btn-primary" type="submit">
          Enregistrer
        </button>
      </div>

      {/* Preview section - shows iframe if URL is valid */}
      {props.cleanedUrl ? (
        <div className="relative w-full overflow-hidden rounded-lg">
          {/* Loading skeleton while iframe content loads */}
          {props.isLoading ? (
            <div className="w-full h-[500px] bg-base-200 flex flex-col justify-center items-center gap-3 animate-pulse">
              <div className="skeleton w-3/4 h-6 rounded"></div>
              <div className="skeleton w-5/6 h-6 rounded"></div>
              <div className="skeleton w-2/3 h-6 rounded"></div>
              <p className="text-sm text-base-content/60 mt-4">
                Chargement de la ressource...
              </p>
            </div>
          ) : null}

          <ResourceIFramePreview
            isLoading={props.isLoading}
            setIsLoading={props.setIsLoading}
            url={props.cleanedUrl}
          />
        </div>
      ) : // Empty state when no valid URL is provided
      null}
    </form>
  );
}

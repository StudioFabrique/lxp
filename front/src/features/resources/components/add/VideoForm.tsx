import { ChangeEvent } from "react";
import { UseFormRegister, UseFormWatch, FieldErrors } from "react-hook-form";
import type { VideoFormValues } from "../../../lesson/media.schema";
import FormInput from "../../../../components/form/FormInput";
import BoxWrapper from "../../../../components/wrappers/BoxWrapper";
import VideoPlayer from "../../../../components/UI/VideoPlayer";

type Props = {
  mode: "read" | "edit" | "write";
  data: {
    register: UseFormRegister<VideoFormValues>;
    errors: FieldErrors<VideoFormValues>;
    watch: UseFormWatch<VideoFormValues>;
  };
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onSetFile: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function VideoForm(props: Props) {
  const url = props.data.watch("url");

  return (
    <form className="flex flex-col gap-y-2" onSubmit={props.onSubmit}>
      <BoxWrapper>
        <FormInput
          label="Titre *"
          placeholder="Titre de l'activité"
          name="title"
          register={props.data.register}
          error={props.data.errors.title}
        />
      </BoxWrapper>

      <BoxWrapper>
        <span className="flex justify-between items-start gap-x-8">
          <div className="flex-1 space-y-3">
            <label className="flex flex-col gap-1">Provenance
              <select {...props.data.register("origin")} className="select select-bordered">
                <option value="web">Lien externe</option><option value="file">Votre ordinateur</option>
              </select>
            </label>
            {props.data.watch("origin") === "web" ? <FormInput label="URL de la vidéo *" placeholder="https://www.youtube.com/..." name="url" register={props.data.register} error={props.data.errors.url} /> :
              <label className="flex flex-col gap-1">Fichier vidéo<input type="file" accept="video/*" onChange={props.onSetFile} />{props.data.errors.file && <span className="text-error text-xs">{props.data.errors.file.message}</span>}</label>}
          </div>
          <VideoPlayer url={url as string} />
        </span>
      </BoxWrapper>

      <div className="flex justify-end gap-x-4 items-center mt-4">
        <button
          className="btn btn-secondary btn-outline"
          type="button"
          onClick={props.onClose}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
}

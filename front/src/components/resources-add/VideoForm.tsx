import { ChangeEvent } from "react";
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import FormInput from "../form/FormInput";
import Wrapper from "../wrappers/BoxWrapper";
import VideoPlayer from "../../components/UI/VideoPlayer";

type Props = {
  mode: "read" | "edit" | "write";
  data: {
    register: UseFormRegister<any>;
    errors: any;
    watch: UseFormWatch<any>;
  };
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onSetFile: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function VideoForm(props: Props) {
  const url = props.data.watch("url");

  return (
    <form className="flex flex-col gap-y-2">
      <Wrapper>
        <FormInput
          label="Titre *"
          placeholder="Titre de l'activité"
          name="title"
          register={props.data.register}
          error={props.data.errors.title}
        />
      </Wrapper>

      <Wrapper>
        <span className="flex justify-between items-start gap-x-8">
          <FormInput
            label="URL de la vidéo *"
            placeholder="https://www.youtube.com/..."
            name="url"
            register={props.data.register}
            error={props.data.errors.url}
          />
          <VideoPlayer url={url as string} />
        </span>
      </Wrapper>

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
          onClick={props.onSubmit}
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
}

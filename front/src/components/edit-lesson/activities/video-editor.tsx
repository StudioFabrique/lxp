import { ChangeEvent } from "react";

interface VideoEditorProps {
  origin: string;
  file: File | null;
  url: string;
  onChangeOrigin: (event: ChangeEvent<HTMLSelectElement>) => void;
  onSelectFile: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeUrl: (event: ChangeEvent<HTMLInputElement>) => void;
  onSelectExternalSource: () => void;
}

export default function VideoEditor(props: VideoEditorProps) {
  return (
    <>
      <section>
        <label htmlFor="origin">
          Sélectionner la provenance de la vidéo
          <select
            name="origin"
            id="origin"
            value={props.origin}
            onChange={props.onChangeOrigin}
          >
            <option value="fileSystem">Votre ordinateur</option>
            <option value="web">Un lien externe</option>
          </select>
        </label>
      </section>
      <section>
        {props.origin === "fileSystem" ? (
          <input
            type="file"
            name="fileUpload"
            id="fileUpload"
            onChange={props.onSelectFile}
          />
        ) : (
          <div className="flex items-center gap-x-2">
            <input
              type="text"
              name="httpsLink"
              id="httpsLink"
              placeholder="Lien https"
              value={props.url}
              onChange={props.onChangeUrl}
            />
            <button
              className="btn btn-sm btn-primary btn-outline"
              onClick={props.onSelectExternalSource}
            >
              Aperçu
            </button>
          </div>
        )}
      </section>
    </>
  );
}

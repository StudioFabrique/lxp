import { ChangeEvent, useState } from "react";
import { ActivitySelectMode } from "../../../views/lessons-preview/store/lessons-preview-reducer";

type Props = {
  mode: ActivitySelectMode;
  title?: string;
  src?: string;
  onEditTitle: (title: string) => void;
  onChangeSrc: (url: string) => void;
};

// Composant pour afficher ou éditer une ressource iframe
const IframeActivity = ({
  mode,
  title,
  src = "",
  onEditTitle,
  onChangeSrc,
}: Props) => {
  const [iframeUrl, setIframeUrl] = useState(src);

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    onEditTitle(newTitle);
  };

  const handleChangeUrl = (e: ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setIframeUrl(newUrl);
    onChangeSrc(newUrl);
  };

  return (
    <div className="w-full flex flex-col gap-4 mt-5">
      {/* Mode édition : champ d'URL */}
      {mode === "write" && (
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-primary">
              Titre de la ressource iframe
            </span>
          </label>
          <input
            type="text"
            placeholder="..."
            className="input input-bordered w-full"
            value={title}
            onChange={handleChangeTitle}
          />
          <label className="label mt-5">
            <span className="label-text font-semibold text-primary">
              URL de la ressource iframe
            </span>
          </label>
          <input
            type="text"
            placeholder="https://example.com"
            className="input input-bordered w-full"
            value={iframeUrl}
            onChange={handleChangeUrl}
          />
        </div>
      )}

      {/* Conteneur de l’iframe */}
      {iframeUrl ? (
        <div className="relative w-full overflow-hidden rounded-lg border border-base-300">
          <iframe
            src={iframeUrl}
            title="Iframe Activity"
            className="w-full h-[500px] rounded-lg"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="p-6 bg-base-200 text-center rounded-lg text-base-content/70">
          <p>
            {mode === "write"
              ? "Saisis une URL ci-dessus pour prévisualiser le contenu."
              : "Aucune ressource iframe disponible."}
          </p>
        </div>
      )}
    </div>
  );
};

export default IframeActivity;

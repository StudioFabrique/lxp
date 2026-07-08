import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { ActivitySelectMode } from "../../../views/module-content-explorer/store/module-explorer-reducer";
import cleanIframeLink from "../../../utils/clean-iframe-link";
import SaveButton from "../../../../src/components/tiptap-editor/components/SaveButton";
import QuestionMarkTooltip from "../../UI/question-mark-tooltip/question-mark-tooltip";

type Props = {
  mode: ActivitySelectMode;
  title?: string;
  src?: string;
  onEditTitle: (title: string) => void;
  onChangeSrc: (src: string) => void;
  onSave: () => Promise<boolean>;
  onFinishSaving: () => void;
};

const IframeActivity = ({
  mode,
  title = "",
  src = "",
  onEditTitle,
  onChangeSrc,
  onSave,
  onFinishSaving,
}: Props) => {
  const [iframeUrl, setIframeUrl] = useState<string>(src);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  // Nettoyage du lien iframe
  const cleanedUrl = useMemo(() => {
    try {
      return iframeUrl.length > 0 ? cleanIframeLink(iframeUrl) : "";
    } catch (error) {
      setUrlError((error as Error).message);
      return "";
    }
  }, [iframeUrl]);

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    onEditTitle(e.target.value);
  };

  const handleChangeUrl = (e: ChangeEvent<HTMLInputElement>) => {
    setUrlError(null);
    setIframeUrl(e.target.value);
  };

  const handleSave = async () => {
    setIsUploading(true);
    if (await onSave()) {
      onFinishSaving();
      setIsUploading(false);
    } else {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    onChangeSrc(cleanedUrl);
  }, [cleanedUrl, onChangeSrc]);

  return (
    <div className="w-full flex flex-col gap-4 mt-5 select-none">
      {["write", "edit"].includes(mode) && (
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-primary">
              Titre de la ressource interactive
            </span>
          </label>
          <input
            type="text"
            placeholder="Titre de la ressource"
            className="input input-bordered w-full"
            value={title}
            onChange={handleChangeTitle}
          />

          <label className="label mt-5">
            <span className="label-text font-semibold text-primary">
              URL iframe de la ressource
            </span>
            <QuestionMarkTooltip
              tooltipValue={`Pour afficher une ressource interactive :
              1. Cherchez le bouton "Partager" ou "Intégrer" sur votre outil (Genially, YouTube, etc.).
              2. Copiez l'adresse (URL) ou le code complet commençant par <iframe...>.
              3. Collez-le simplement dans le champ ci-dessous.`}
              tooltipPosition="bottom"
            />
          </label>
          <input
            type="text"
            placeholder='https://example.com ou <iframe src="" /> '
            className={`input input-bordered w-full ${
              urlError ? "input-error" : ""
            }`}
            value={iframeUrl}
            onChange={handleChangeUrl}
          />
          <span className="text-error">{urlError}</span>
        </div>
      )}

      {cleanedUrl ? (
        <div className="relative w-full overflow-hidden rounded-lg">
          {isLoading && (
            <div className="w-full h-[500px] bg-base-200 flex flex-col justify-center items-center gap-3 animate-pulse">
              <div className="skeleton w-3/4 h-6 rounded"></div>
              <div className="skeleton w-5/6 h-6 rounded"></div>
              <div className="skeleton w-2/3 h-6 rounded"></div>
              <p className="text-sm text-base-content/60 mt-4">
                Chargement de la ressource...
              </p>
            </div>
          )}

          <iframe
            src={cleanedUrl}
            title="Iframe Activity"
            className="w-full h-[500px] rounded-lg"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
            hidden={isLoading}
          />
        </div>
      ) : (
        <div className="p-6 bg-base-200 text-center rounded-lg text-base-content/70">
          <p>
            {mode === "write"
              ? "Saisir une URL ci-dessus pour prévisualiser le contenu."
              : "Aucune ressource iframe disponible."}
          </p>
        </div>
      )}

      {mode !== "read" && iframeUrl && (
        <SaveButton onSave={handleSave} pending={isUploading} />
      )}
    </div>
  );
};

export default IframeActivity;

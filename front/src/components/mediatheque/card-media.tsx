import { cloneElement, ReactElement, useEffect, useState } from "react";
import { displaySize } from "../../utils/helpers/size-unit-conversion";
import Media from "../../utils/interfaces/media";
import { ClipboardCheck, Copy, Trash2 } from "lucide-react";

type Props = {
  media: Media;
  children: ReactElement;
};

function CardMedia({ children, media }: Props) {
  const channel = new BroadcastChannel("clipboardChannel");
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    const valueToCopy = media.url;
    try {
      await navigator.clipboard.writeText(valueToCopy);
      channel.postMessage(valueToCopy); // Envoie le message à tous les onglets
      setCopied(true);
    } catch (error) {
      console.error("Échec de la copie : ", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopied(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <div className="card glass w-64">
      {cloneElement(children, { handleCopyUrl, copied } as any)}
      <div className="card-body text-xs">
        <span className="flex justify-between">
          <p>Taille :</p>
          <p className="text-end">{displaySize(media.size)}</p>
        </span>
        <span className="flex justify-between">
          <p>Utilisé :</p>
          <p className="text-end">{media.used} fois</p>
        </span>

        <div className="card-actions justify-end mt-2">
          <span className="flex items-center gap-x-4">
            <div className="tooltip" data-tip={copied ? "Copié" : "Copier"}>
              <button onClick={handleCopyUrl}>
                {!copied ? (
                  <Copy className="w-5 h-5 text-primary" />
                ) : (
                  <ClipboardCheck className="w-5 h-5 text-success" />
                )}
              </button>
            </div>
            <div
              className="tooltip"
              data-tip={
                media.used > 0
                  ? "Ce fichier est utilisé"
                  : "Supprimer le fichier"
              }
            >
              <button disabled={media.used > 0}>
                <Trash2
                  className={`w-5 h-5 ${
                    media.used > 0 ? "text-gray-500" : "text-error"
                  }`}
                />
              </button>
            </div>
          </span>
        </div>
      </div>
    </div>
  );
}

export default CardMedia;

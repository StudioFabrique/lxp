import React, { useEffect, useState } from "react";
import { ACTIVITIES } from "../../config/urls";
import { displaySize } from "../../helpers/sizeUnitConversion";
import { CheckCircle } from "lucide-react";
import Media from "../../utils/interfaces/media";

type Props = {
  media: Media;
};

function CardMedia({ media }: Props) {
  const channel = new BroadcastChannel("clipboardChannel");
  const [copied, setCopied] = useState(false);

  const classImage: React.CSSProperties = {
    backgroundImage: `url(${ACTIVITIES + "images/" + media.url})`,

    width: "100%",
    height: "9rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    position: "relative",
  };

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
    }, 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <div className="card glass w-80 h-80">
      <figure style={classImage}>
        <span className="w-full h-full flex justify-end items-end p-2">
          <button className="btn btn-sm btn-primary" onClick={handleCopyUrl}>
            <span className="flex gap-x-2 items-center">
              <p>Importer</p>
              {copied && <CheckCircle className="w-4 h-4" />}
            </span>
          </button>
        </span>
      </figure>
      <div className="card-body">
        <h2 className="card-title flex justify-between">
          <p>Media :</p>
          <p className="capitalize text-end">{media.type}</p>
        </h2>
        <span className="flex justify-between">
          <p>Taille :</p>
          <p className="text-end">{displaySize(media.size)}</p>
        </span>
        <span className="flex justify-between">
          <p>Utilisé :</p>
          <p className="text-end">{media.used} fois</p>
        </span>

        <div className="card-actions justify-end mt-2"></div>
      </div>
    </div>
  );
}

export default CardMedia;

import { useEffect, useMemo, useState } from "react";
import ReactPlayer from "react-player";
import { extractYouTubeId } from "./extractYoutubeId";
import ElementNotFound from "./element-not-found";

type Props = {
  url: string;
  size?: "small" | "medium" | "large";
};

export default function VideoPlayer({ url, size = "small" }: Props) {
  const [videoError, setVideoError] = useState(false);

  const dimensions = useMemo(() => {
    switch (size) {
      case "medium":
        return { width: 500, height: 300 };
      case "large":
        return { width: 800, height: 600 };
      default:
        return { width: 200, height: 125 };
    }
  }, [size]);

  const playerUrl = useMemo(() => {
    const id = extractYouTubeId(url);
    if (id) return `https://www.youtube.com/watch?v=${id}`;
    return url;
  }, [url]);

  useEffect(() => {
    setVideoError(false);
  }, [playerUrl]);

  return (
    <>
      {playerUrl ? (
        <>
          <ReactPlayer
            // react-player 3 attend `src` : la propriété `url` des versions
            // antérieures était ignorée en silence, et aucune vidéo ne se
            // chargeait. Le transtypage en `any` qui enveloppait le composant
            // empêchait le compilateur de le signaler.
            src={playerUrl}
            controls
            style={{
              borderRadius: "5px",
              backgroundColor: "black",
              padding: "5px",
            }}
            width={dimensions.width}
            height={dimensions.height}
            onError={() => setVideoError(true)}
          />
          {videoError && (
            <div className="text-error text-xs mt-1 text-center">
              Impossible de lire la vidéo (URL invalide).
            </div>
          )}
        </>
      ) : (
        <div>
          {url ? (
            <ElementNotFound message="Impossible de lire la vidéo, il est possible que l'auteur n'autorise pas la lecture en dehors de la plateforme d'origine." />
          ) : (
            <ElementNotFound message="Un aperçu de la vidéo s'affichera ici." />
          )}
        </div>
      )}
    </>
  );
}

import { useEffect, useMemo, useState } from "react";
import ReactPlayer from "react-player";
import { extractYouTubeId } from "../../../src/utils/helpers/extractYoutubeId";
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

  const ReactPlayerComponent = ReactPlayer as any;

  return (
    <>
      {playerUrl ? (
        <>
          <ReactPlayerComponent
            url={playerUrl}
            controls
            style={{
              borderRadius: "5px",
              backgroundColor: "black",
              padding: "5px",
            }}
            width={dimensions.width}
            height={dimensions.height}
            onError={(e: any) => {
              console.warn("ReactPlayer error on url:", playerUrl, e);
              setVideoError(true);
            }}
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

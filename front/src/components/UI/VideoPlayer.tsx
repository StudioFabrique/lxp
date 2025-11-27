import { useEffect, useMemo, useState } from "react";
import ReactPlayer from "react-player";
import { extractYouTubeId } from "../../helpers/extractYoutubeId";
import ElementNotFound from "./element-not-found";

type Props = {
  url: string;
  size?: "small" | "medium" | "large";
};

/**
 * VideoPlayer Component
 *
 * A responsive video player component that supports YouTube and maybe other video providers.
 * Automatically extracts YouTube video IDs and handles video playback errors.
 *
 * @param url - The video URL (YouTube or other supported providers)
 * @param size - The player size: "small" (200x125), "medium" (500x300), or "large" (800x600). Defaults to "small"
 */
export default function VideoPlayer({ url, size = "small" }: Props) {
  const [videoError, setVideoError] = useState(false);

  // Calculate player dimensions based on the selected size
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

  // Process the URL to ensure proper YouTube format or return the raw URL for other providers
  const playerUrl = useMemo(() => {
    const id = extractYouTubeId(url);
    if (id) return `https://www.youtube.com/watch?v=${id}`;
    // If not a recognized YouTube ID, return the raw value (ReactPlayer supports other providers)
    return url;
  }, [url]);

  useEffect(() => {
    // Reset video error state when the URL changes
    setVideoError(false);
  }, [playerUrl]);

  return (
    <>
      {playerUrl ? (
        <>
          <ReactPlayer
            url={playerUrl}
            controls
            style={{
              borderRadius: "5px",
              backgroundColor: "black",
              padding: "5px",
            }}
            width={dimensions.width}
            height={dimensions.height}
            onError={(e) => {
              console.warn("ReactPlayer error on url:", playerUrl, e);
              setVideoError(true);
            }}
          />
          {videoError && (
            <div className="text-error text-xs mt-1 text-center">
              Unable to play the video (invalid URL).
            </div>
          )}
        </>
      ) : (
        <ElementNotFound message="Impossible de lire la vidéo, il est possible que l'auteur n'autorise pas la lecture en dehors de sa plateforme d'origine." />
      )}
    </>
  );
}

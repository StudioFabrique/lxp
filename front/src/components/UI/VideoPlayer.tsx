import { useEffect, useMemo, useState } from "react";
import ReactPlayer from "react-player";
import { extractYouTubeId } from "../../helpers/extractYoutubeId";
import ElementNotFound from "./element-not-found";

type Props = {
  /** The video URL from YouTube or other supported providers */
  url: string;
  /** The display size of the video player. Defaults to "small" */
  size?: "small" | "medium" | "large";
};

/**
 * VideoPlayer Component
 *
 * A responsive video player component that supports YouTube and other video providers.
 * Automatically extracts YouTube video IDs from various URL formats and handles video playback errors.
 *
 * Features:
 * - Supports multiple video sizes (small, medium, large)
 * - Automatically normalizes YouTube URLs
 * - Displays error messages when video playback fails
 * - Shows helpful messages when no URL is provided or when the video cannot be embedded
 *
 * @param url - The video URL (YouTube or other supported providers)
 * @param size - The player size: "small" (200x125), "medium" (500x300), or "large" (800x600). Defaults to "small"
 *
 * @example
 * <VideoPlayer url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" size="medium" />
 */
export default function VideoPlayer({ url, size = "small" }: Props) {
  // Track whether an error occurred during video playback
  const [videoError, setVideoError] = useState(false);

  /**
   * Calculate player dimensions based on the selected size
   * Memoized to prevent unnecessary recalculations
   */
  const dimensions = useMemo(() => {
    switch (size) {
      case "medium":
        return { width: 500, height: 300 };
      case "large":
        return { width: 800, height: 600 };
      default: // "small"
        return { width: 200, height: 125 };
    }
  }, [size]);

  /**
   * Process the URL to ensure proper YouTube format or return the raw URL for other providers
   * Extracts YouTube video ID and reconstructs a standard YouTube URL
   * Falls back to the original URL if it's not a YouTube video (ReactPlayer supports various providers)
   */
  const playerUrl = useMemo(() => {
    const id = extractYouTubeId(url);
    // If a YouTube ID was extracted, construct a standard YouTube watch URL
    if (id) return `https://www.youtube.com/watch?v=${id}`;
    // If not a recognized YouTube ID, return the raw value (ReactPlayer supports other providers like Vimeo, Dailymotion, etc.)
    return url;
  }, [url]);

  /**
   * Reset error state when the video URL changes
   * This ensures errors from previous videos don't persist
   */
  useEffect(() => {
    setVideoError(false);
  }, [playerUrl]);

  return (
    <>
      {playerUrl ? (
        <>
          {/* Video player wrapper */}
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
              // Log the error for debugging purposes
              console.warn("ReactPlayer error on url:", playerUrl, e);
              // Update state to display error message to the user
              setVideoError(true);
            }}
          />
          {/* Display error message if video failed to load */}
          {videoError && (
            <div className="text-error text-xs mt-1 text-center">
              Impossible de lire la vidéo (URL invalide).
            </div>
          )}
        </>
      ) : (
        <div>
          {/* Display different messages based on whether a URL was provided */}
          {url ? (
            // URL was provided but couldn't be processed
            <ElementNotFound message="Impossible de lire la vidéo, il est possible que l'auteur n'autorise pas la lecture en dehors de la plateforme d'origine." />
          ) : (
            // No URL provided - show placeholder message
            <ElementNotFound message="Un aperçu de la vidéo s'affichera ici." />
          )}
        </div>
      )}
    </>
  );
}

// Import des dépendances nécessaires
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { ACTIVITIES_VIDEOS } from "../../config/urls";

/**
 * Props for the VideoPlayer component
 */
interface VideoPlayerProps {
  /** Video source URL (can be external URL or local filename) */
  source: string;
  /** Optional description text to display above the video player */
  description?: string;
}

/**
 * Video Player Component
 *
 * Displays a video player with an optional description.
 * Supports two types of video sources:
 * - External URLs (YouTube, Vimeo, etc.) - URLs starting with "http"
 * - Local videos - Filenames that are prefixed with the ACTIVITIES_VIDEOS base URL
 *
 * The component automatically detects the source type and constructs
 * the appropriate URL for the ReactPlayer component.
 *
 * @param props Component props containing video source and optional description
 * @returns JSX.Element - Video player with description
 */
export default function VideoPlayer({ source, description }: VideoPlayerProps) {
  // State to store the final video URL (external or constructed local URL)
  const [videoUrl, setVideoUrl] = useState("");

  /**
   * Effect to construct the video URL based on source type
   * - If source starts with "http": Use as-is (external URL)
   * - Otherwise: Prepend ACTIVITIES_VIDEOS base URL (local video)
   */
  useEffect(() => {
    if (source !== undefined) {
      // Check if source is an external URL (YouTube, Vimeo, etc.)
      if (source.startsWith("https://")) {
        setVideoUrl(source);
      } else {
        // Construct URL for locally hosted video
        setVideoUrl(ACTIVITIES_VIDEOS + source);
      }
    }
  }, [source]);

  return (
    <div className="w-full flex flex-col items gap-y-2">
      {/* Description label */}
      <p className="text-xs">Description</p>

      {/* Video description text */}
      <h2>{description}</h2>

      {/* Video player container (centered) */}
      <div className="flex justify-center">
        <ReactPlayer url={videoUrl} controls />
      </div>
    </div>
  );
}

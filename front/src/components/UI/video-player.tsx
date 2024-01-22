import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { ACTIVITIES_VIDEOS } from "../../config/urls";

interface VideoPlayerProps {
  source: string;
  title?: string;
  description?: string;
}

export default function VideoPlayer({
  source,
  title,
  description,
}: VideoPlayerProps) {
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    if (source !== undefined) {
      if (source.startsWith("http")) {
        setVideoUrl(source);
      } else {
        setVideoUrl(ACTIVITIES_VIDEOS + source);
      }
    }
  }, [source]);

  return (
    <div className="flex flex-col gap-y-2">
      <h2>{title}</h2>
      <h2>{description}</h2>
      <ReactPlayer url={videoUrl} controls />
    </div>
  );
}

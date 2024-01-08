import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { ACTIVITIES_VIDEOS } from "../../config/urls";

interface VideoPlayerProps {
  source: string;
}

export default function VideoPlayer({ source }: VideoPlayerProps) {
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
    <div>
      <ReactPlayer url={videoUrl} controls />
    </div>
  );
}

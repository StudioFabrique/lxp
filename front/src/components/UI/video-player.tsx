import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { ACTIVITIES_VIDEOS } from "../../config/urls";
import Wrapper from "./wrapper/wrapper.component";

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
    <div className="w-full flex flex-col items gap-y-2">
      <Wrapper>
        {title !== undefined ? (
          <>
            <p className="text-xs">Titre</p>
            <Wrapper>
              <h2>{title}</h2>
            </Wrapper>
            <p className="text-xs">Description</p>
            <Wrapper>
              <h2>{description}</h2>
            </Wrapper>
          </>
        ) : null}
        <div className="flex justify-center">
          <ReactPlayer url={videoUrl} controls />
        </div>
      </Wrapper>
    </div>
  );
}

import ReactPlayer from "react-player";

interface VideoPlayerProps {
  source: string;
}

export default function VideoPlayer({ source }: VideoPlayerProps) {
  return (
    <div>
      <ReactPlayer url={source} controls />
    </div>
  );
}

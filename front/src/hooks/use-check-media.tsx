import { useEffect, useState } from "react";
import useHttp from "./use-http";
import toast from "react-hot-toast";

type Response = {
  result: boolean;
};

export type Media = {
  id: number;
  url: string;
  originalName: string;
  type: string;
  size: number;
  used: number;
};

type SuccessResponse = Response & { media: Media };

const useCheckMedia = () => {
  const { error, isLoading, sendRequest } = useHttp();
  const [media, setMedia] = useState<Media | null>(null);
  const [result, setResult] = useState<"no-media" | null>(null);

  const checkMedia = (fileName: string) => {
    const applyData = (data: Response | SuccessResponse) => {
      if ("media" in data) {
        setMedia(data.media);
      } else if (media) {
        setMedia(null);
        setResult("no-media");
      }
    };
    sendRequest(
      {
        path: "/mediatheque?filename=" + fileName,
      },
      applyData
    );
  };

  useEffect(() => {
    if (error.length > 0) toast.error(error);
    return () => setMedia(null);
  }, [error]);

  return { error, isLoading, checkMedia, media, result };
};

export default useCheckMedia;

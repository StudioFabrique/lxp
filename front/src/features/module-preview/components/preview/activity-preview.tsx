/* eslint-disable @typescript-eslint/no-explicit-any */
import "./video-style.css";
import { useEffect, useState } from "react";
import type {
  Activity,
  Resource,
} from "../../../../../src.legacy/utils/interfaces/activity";
import {
  ACTIVITIES,
  ACTIVITIES_VIDEOS,
} from "../../../../../src.legacy/config/urls";
import BaseReactPlayer from "react-player";
import { ExternalLink, File } from "lucide-react";

type ActivityProps = {
  activity?: Activity;
};

/**
 * Preview des activités de type video, image et ressources contenant des fichiers (PDF, powerpoint...)
 */
const ActivityPreview = ({ activity }: ActivityProps) => {
  const [url, setUrl] = useState("");

  // case when a activity contains a set of pdf files
  const [pdfUrls, setPdfUrls] = useState<Resource[]>([]);

  useEffect(() => {
    if (activity?.url) {
      if (activity.url.startsWith("http")) {
        setUrl(activity.url);
      } else {
        setUrl(ACTIVITIES_VIDEOS + activity.url);
      }
    }
  }, [activity?.url]);

  // Récupération et formatage des ressources pdf
  useEffect(() => {
    if (activity?.type === "resource" && activity.resourceActivities) {
      const resources = activity.resourceActivities.map((act) => ({
        ...act,
        url: act.url.startsWith("http")
          ? act.url
          : `${ACTIVITIES}files/${act.url}`,
      }));

      setPdfUrls(resources);
    }
  }, [activity?.resourceActivities, activity?.type]);

  const renderPreviewComponent = () => {
    switch (activity?.type) {
      case "video":
        return (
          <div className="flex flex-col items-center gap-2">
            <BaseReactPlayer url={url} controls />
          </div>
        );
      case "image":
        return (
          <div className="flex flex-col gap-2">
            <img src={`${ACTIVITIES}images/${activity.url}`} alt="activity" />
          </div>
        );
      case "resource":
        return (
          <div className="flex flex-col justify-center gap-4">
            {pdfUrls
              .sort((a, b) => a.order - b.order)
              .map((pdf) => (
                <a
                  key={pdf.url}
                  href={pdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm w-full justify-between py-5"
                >
                  <span className="flex items-center gap-2">
                    <File />
                    <span>{pdf.label}</span>
                  </span>
                  <ExternalLink className="w-5" />
                </a>
              ))}
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="mt-5">{renderPreviewComponent()}</div>;
};

export default ActivityPreview;

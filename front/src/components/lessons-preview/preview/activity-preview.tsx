/* eslint-disable @typescript-eslint/no-explicit-any */
import "./video-style.css";
import { useEffect, useState } from "react";
import type { Activity, Resource } from "../../../utils/interfaces/activity";
import { ACTIVITIES, ACTIVITIES_VIDEOS } from "../../../config/urls";
import BaseReactPlayer from "react-player";
import TipTapActivity from "../writing/tip-tap-activity";
import { File } from "lucide-react";

type ActivityProps = {
  lessonId: number;
  activity: Activity;
  onActivityEditChange?: (isEditing: boolean) => void;
  shouldEdit?: boolean;
  forceStopEdit?: boolean;
};

const ActivityPreview = ({
  lessonId,
  activity,
  onActivityEditChange,
  shouldEdit = false,
  forceStopEdit = false,
}: ActivityProps) => {
  const [value, setValue] = useState<string>("");
  const [url, setUrl] = useState("");

  // case when a activity contains a set of pdf files
  const [pdfUrls, setPdfUrls] = useState<Resource[]>([]);

  useEffect(() => {
    if (activity.url !== undefined) {
      if (activity.url.startsWith("http")) {
        setUrl(activity.url);
      } else {
        setUrl(ACTIVITIES_VIDEOS + activity.url);
      }
    }
  }, [activity.url]);

  // Récupération et formatage des ressources pdf
  useEffect(() => {
    if (activity.type === "resource" && activity.resourceActivities) {
      const resources = activity.resourceActivities.map((act) => ({
        ...act,
        url: act.url.startsWith("http")
          ? act.url
          : `${ACTIVITIES}files/${act.url}`,
      }));

      setPdfUrls(resources);
    }
  }, [activity.resourceActivities, activity.type]);

  /**
   * récupère le contenu d'un fichier markdown depuis le serveur
   */
  useEffect(() => {
    if (activity && activity !== undefined) {
      fetch(`${ACTIVITIES}${activity.url}`)
        .then((response) => response.text())
        //.then((text) => md.render(text))
        .then((mdContent: string) => {
          setValue(mdContent);
        });
    }
  }, [activity, activity.url]);

  const renderPreviewComponent = () => {
    switch (activity.type) {
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
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col gap-2">
              {pdfUrls
                .sort((a, b) => a.order - b.order)
                .map((pdf) => (
                  <a
                    key={pdf.url}
                    href={`${ACTIVITIES}files/${pdf.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm flex items-center gap-2"
                  >
                    <File />
                    <span>{pdf.label}</span>
                  </a>
                ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {activity.type === "text" && value && (
        <TipTapActivity
          parentId={lessonId}
          activity={{
            ...activity,
            content: value,
          }}
          onActivityEditChange={onActivityEditChange}
          shouldStartEdit={shouldEdit}
          forceStopEdit={forceStopEdit}
        />
      )}
      {renderPreviewComponent()}
    </>
  );
};

export default ActivityPreview;

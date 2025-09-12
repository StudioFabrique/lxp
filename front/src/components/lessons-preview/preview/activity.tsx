/* eslint-disable @typescript-eslint/no-explicit-any */
import "./video-style.css";
import { useEffect, useState } from "react";
import type { Activity, Resource } from "../../../utils/interfaces/activity";
import { ACTIVITIES, ACTIVITIES_VIDEOS } from "../../../config/urls";
import BaseReactPlayer from "react-player";
import TipTapActivity from "../writing/tip-tap-activity";
import VideoActivityEditing from "../writing/video-activity-editing";
import ImageActivityEditing from "../writing/image-activity-editing";
import ResourceActivityEditing from "../writing/resource-activity-editing";
import { File } from "lucide-react";

type ActivityProps = {
  lessonId: number;
  activity: Activity;
  onActivityEditChange?: (isEditing: boolean) => void;
  onRefreshAllData?: () => void;
  shouldEdit?: boolean;
  forceStopEdit?: boolean;
};

const ActivityPreview = ({
  lessonId,
  activity,
  onActivityEditChange,
  onRefreshAllData,
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

  const renderContent = () => {
    // Pour le texte, on utilise toujours TipTapActivity qui gère déjà l'édition
    if (activity.type === "text") {
      return value ? (
        <TipTapActivity
          parentId={lessonId}
          activity={{
            id: activity.id,
            title: activity.title,
            content: value,
          }}
          onActivityEditChange={onActivityEditChange}
          shouldStartEdit={shouldEdit}
          forceStopEdit={forceStopEdit}
        />
      ) : null;
    }

    // Pour les autres types, on affiche le contenu normal ou l'éditeur
    const renderEditingComponent = () => {
      switch (activity.type) {
        case "video":
          return (
            <VideoActivityEditing
              activity={activity}
              onRefreshAllData={onRefreshAllData}
              onActivityEditChange={onActivityEditChange}
              shouldStartEdit={shouldEdit}
              forceStopEdit={forceStopEdit}
            />
          );
        case "image":
          return (
            <ImageActivityEditing
              activity={activity}
              onRefreshAllData={onRefreshAllData}
              onActivityEditChange={onActivityEditChange}
              shouldStartEdit={shouldEdit}
              forceStopEdit={forceStopEdit}
            />
          );
        case "resource":
          return (
            <ResourceActivityEditing
              activity={activity}
              onRefreshAllData={onRefreshAllData}
              onActivityEditChange={onActivityEditChange}
              shouldStartEdit={shouldEdit}
              forceStopEdit={forceStopEdit}
            />
          );
        default:
          return null;
      }
    };

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
        {renderPreviewComponent()}
        {renderEditingComponent()}
      </>
    );
  };

  return renderContent();
};

export default ActivityPreview;

/* eslint-disable @typescript-eslint/no-explicit-any */
import "./video-style.css";
import { useEffect, useState } from "react";
import type { Activity, Resource } from "../../../utils/interfaces/activity";
import { ACTIVITIES, ACTIVITIES_VIDEOS } from "../../../config/urls";
import BaseReactPlayer from "react-player";
import TipTapActivity from "../writing/tip-tap-activity";
import ActivityWrapper from "./activity-wrapper";
import { File } from "lucide-react";
import useHttp from "../../../hooks/use-http";
import toast from "react-hot-toast";

type ActivityProps = {
  lessonId: number;
  activity: Activity;
  isAnyActivityBeingEdited?: boolean;
  onActivityEditChange?: (isEditing: boolean) => void;
  onDeleteActivity?: (activityId: number) => void;
};

/* const md = markdownit(); */

const ActivityPreview = ({
  lessonId,
  activity,
  isAnyActivityBeingEdited = false,
  onActivityEditChange,
  onDeleteActivity,
}: ActivityProps) => {
  const { sendRequest } = useHttp(true);
  const [value, setValue] = useState<string>("");
  const [url, setUrl] = useState("");

  // case when a activity contains a set of pdf files
  const [pdfUrls, setPdfUrls] = useState<Resource[]>([]);

  const handleDeleteActivity = () => {
    if (!activity?.id) return;

    // Suppression instantanée dans le front
    onDeleteActivity?.(activity.id);
    toast.success("Activité supprimée");

    // Appel au backend en arrière-plan
    const applyData = () => {
      // Backend confirmé - pas besoin d'action supplémentaire
    };

    sendRequest(
      {
        path: `/activity/${activity.type}/${activity.id}`,
        method: "delete",
      },
      applyData
    );
  };

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
    const contentMap = {
      text: value ? (
        <TipTapActivity
          lessonId={lessonId}
          activity={{
            id: activity.id,
            title: activity.title,
            content: value,
          }}
          isAnyActivityBeingEdited={isAnyActivityBeingEdited}
          onActivityEditChange={onActivityEditChange}
          onDeleteActivity={onDeleteActivity}
        />
      ) : null,
      video: (
        <ActivityWrapper
          activity={activity}
          onDeleteActivity={handleDeleteActivity}
          showEditButton={false}
        >
          <div className="flex flex-col items-center gap-2">
            <BaseReactPlayer url={url} controls />
          </div>
        </ActivityWrapper>
      ),
      image: (
        <ActivityWrapper
          activity={activity}
          onDeleteActivity={handleDeleteActivity}
          showEditButton={false}
        >
          <div className="flex flex-col gap-2">
            <img src={`${ACTIVITIES}images/${activity.url}`} alt="activity" />
          </div>
        </ActivityWrapper>
      ),
      resource: (
        <ActivityWrapper
          activity={activity}
          onDeleteActivity={handleDeleteActivity}
          showEditButton={false}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col gap-2">
              {pdfUrls
                .sort((a, b) => a.order - b.order)
                .map((pdf) => (
                  <a
                    key={pdf.id}
                    href={pdf.url}
                    className="btn btn-primary text-base-100 flex items-center gap-2"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <File />
                    <span>{pdf.label}</span>
                  </a>
                ))}
            </div>
          </div>
        </ActivityWrapper>
      ),
    };

    const content = contentMap[activity.type as keyof typeof contentMap];

    if (!content) return undefined;

    return <>{content}</>;
  };

  return renderContent();
};

export default ActivityPreview;

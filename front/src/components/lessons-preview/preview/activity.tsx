/* eslint-disable @typescript-eslint/no-explicit-any */
import "./video-style.css";
import { useEffect, useState } from "react";
import type { Activity, Resource } from "../../../utils/interfaces/activity";
import { ACTIVITIES, ACTIVITIES_VIDEOS } from "../../../config/urls";
import BaseReactPlayer from "react-player";
import TipTapActivity from "../writing/tip-tap-activity";
import { File } from "lucide-react";
import { BonusActivity } from "../../../utils/interfaces/resource";

type ActivityProps = {
  lessonId: number;
  activity: Activity | BonusActivity;
  isAnyActivityBeingEdited?: boolean;
  onActivityEditChange?: (isEditing: boolean) => void;
};

/* const md = markdownit(); */

const ActivityPreview = ({
  lessonId,
  activity,
  isAnyActivityBeingEdited = false,
  onActivityEditChange,
}: ActivityProps) => {
  const [value, setValue] = useState<string>("");
  const [url, setUrl] = useState("");

  const parent = "resourceId" in activity ? "resource" : "lesson";

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
  }, [activity, activity.type]);

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
      text:
        // <Markdown className="prose prose-h1:text-primary prose-h1:text-center prose-a:text-center prose-img:max-w-4/6 prose-img:text-center prose-p:text-justify prose-ul:ml-8 max-w-[92%]">
        //   {value}
        // </Markdown>
        value ? (
          <TipTapActivity
            parentId={lessonId}
            activity={{
              id: activity.id,
              title: activity.title,
              content: value,
            }}
            parent={parent}
            isAnyActivityBeingEdited={isAnyActivityBeingEdited}
            onActivityEditChange={onActivityEditChange}
          />
        ) : null,
      video: (
        <div className="flex flex-col gap-2">
          <h3 className="text-base-content font-bold text-2xl">Vidéo</h3>
          <BaseReactPlayer url={url} controls />
        </div>
      ),
      image: (
        <div className="flex flex-col gap-2">
          <img src={`${ACTIVITIES}images/${activity.url}`} alt="activity" />
        </div>
      ),
      resource: (
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-base-content font-bold text-2xl">Resources</h3>
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
      ),
    };

    const content = contentMap[activity.type as keyof typeof contentMap];

    if (!content) return undefined;

    return <>{content}</>;
  };

  return renderContent();
};

export default ActivityPreview;
